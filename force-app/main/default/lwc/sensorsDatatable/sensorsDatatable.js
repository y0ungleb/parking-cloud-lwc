import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import getSensorsList from '@salesforce/apex/DataController.getSensorsList';
import getDefaultNumberRecordsPerPage from '@salesforce/apex/DataController.getDefaultNumberRecordsPerPage';
import csvFileRead from '@salesforce/apex/UploadController.csvFileRead';
//import getBaseStationName from '@salesforce/apex/DataController.getBaseStationName';

export default class SensorsDatatable extends LightningElement {

	/* ======= Variables ======= */

	//Data load
	@track data //Sliced by setTable()
	@track error

	//Pagination
	//@track page = 1
	@track page = 0
	@track items //Actually loaded data
	@track startingRecord = 1
	@track endingRecord = 0
	@track pageSize 
	@track totalRecountCount = 0
	@track totalPage = 0

	//Pagination buttons
	@track isNextLastDisabled = false
	@track isPrevFirstDisabled = true

	//Loading spinner
	@track showLoadingSpinner = false

	//Org's URL
	@track orgUrl = 'https://jetbi95-dev-ed.lightning.force.com/'

	wiredDataResult

	//Data upload
	@track uploadedFiles

	/* ======= Getters ======= */

	get actions() {
		return [
			{ label: 'View Sensor' },
			{ label: 'View Base Station' },
	 		{ label: 'Delete' }
		];
	}

	get columns() {
		return [
			{ label: 'Sensor Name', fieldName: 'Name', type: 'text' },
			{ label: 'Base Station', fieldName: 'Base_Station_Name__c', type: 'text' },
			{ label: 'Status', fieldName: 'Status__c', type: 'text' },
			{ label: 'Sensor Model', fieldName: 'Sensor_model__c', type: 'text' },
			{ label: 'Actions', type: 'action', typeAttributes: { rowActions: this.actions }}
		];
	}

	get comboboxOptions() {
		return [
			{ label: '10', value: '10' },
			{ label: '25', value: '25' },
			{ label: '50', value: '50' },
			{ label: '100', value: '100' },
			{ label: '200', value: '200' }
	  ];
	}

	get acceptedCSVFormats() {
		return ['.csv'];
  }

  get fileColumns() {
	  return ['Base Station','Status','Sensor model'];
  }

	/* ======= Wires ======= */

	@wire(getSensorsList)
	wiredSensors(result) {
		if(result.data) {
			this.wiredDataResult = result;
			setTimeout(() => {
				this.items = result.data;
				this.setTable();
				this.error = undefined;
			}, 50);
			
		}
		else if(result.error) {
			this.error = result.error;
			this.items = undefined;
		}
	}

	@wire(getDefaultNumberRecordsPerPage)
	wireCMT({error, data}) {
		if(data) {
			this.pageSize = data.Def_Rec_Per_Page__c;
		}
		else if(error) {
			this.error = error;
			this.pageSize = undefined;
		}
	}

  /* ======= Handlers ======= */

  uploadFileHandler(event) {
	this.showLoadingSpinner = true;
	this.uploadedFiles = event.detail.files;
	csvFileRead({contentDocumentId: this.uploadedFiles[0].documentId})
	.then(() => {
		this.dispatchEvent(
			new ShowToastEvent({
				title: 'Success',
				message: 'CSV uploaded',
				variant: 'success'
			})
		);
		this.refreshData();
		setTimeout(() => {
			this.showLoadingSpinner = false;
		 }, 400);
	})
	.catch(error => {
		this.dispatchEvent(
			new ShowToastEvent({
				title: 'Error',
				message: 'Uploading error: ' + error.body.message,
				variant: 'error'
			})
		);
		setTimeout(() => {
			this.showLoadingSpinner = false;
		 }, 400);
	});
}

downloadFileHandler() {
	if(this.wiredDataResult.data.length == 0) {
		this.dispatchEvent(
			new ShowToastEvent({
				title: 'Error',
				message: 'Error: Database is empty',
				variant: 'error'
			})
		)
		return;
	}
	let csvResult = '';
	let columnDivider = ',';
	let lineDivider = '\n';

	csvResult += this.fileColumns.join(columnDivider);
	csvResult += lineDivider;

	let wiredResultClone = this.wiredDataResult;
	
	for(let i = 0; i < wiredResultClone.data.length; i++) {
		if(!wiredResultClone.data[i].Base_Station__c || !wiredResultClone.data[i].Status__c || !wiredResultClone.data[i].Sensor_model__c) {
			let arrToConc1 = wiredResultClone.data.slice(0, i);
			let arrToConc2 = wiredResultClone.data.slice(i+1, wiredResultClone.data.length);
			wiredResultClone.data = arrToConc1.concat(arrToConc2);
		}
	}

	for(let i = 0; i < wiredResultClone.data.length; i++) {
		csvResult += wiredResultClone.data[i].Base_Station__r.Name + columnDivider + 
						 wiredResultClone.data[i].Status__c + columnDivider +
						 wiredResultClone.data[i].Sensor_model__c + lineDivider;
	}
	
	let hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvResult);
	hiddenElement.target = '_self';
	hiddenElement.download = 'SensorData.csv'; 
	hiddenElement.click();
	this.dispatchEvent(
		new ShowToastEvent({
			title: 'Success',
			message: 'CSV downloaded',
			variant: 'success'
		})
	);
}

  onRowActionHandler(event) {
	switch(event.detail.action.label) {
		case 'View Sensor': 
				window.open(this.orgUrl + 'lightning/r/Sensor__c/' + event.detail.row.Id + '/view');
				break;
		case 'View Base Station': 
				if(event.detail.row.Base_Station__c == undefined) {
					this.dispatchEvent(
						new ShowToastEvent({
							title: 'Error',
							message: 'Sensor is not assigned to any Base Station',
							variant: 'error'
						})
					);
					break;
				}
				window.open(this.orgUrl + 'lightning/r/Base_Station__c/' + event.detail.row.Base_Station__c + '/view');
				break;
		case 'Delete':
				deleteRecord(event.detail.row.Id)
				.then(() => {
					this.dispatchEvent(
						new ShowToastEvent({
							title: 'Success',
							message: 'Sensor deleted',
							variant: 'success'
						})
					);
					if(this.items.length == 1) {
						this.data = 0;
					}
					this.refreshData();
				})
				.catch(error => {
					this.dispatchEvent(
						new ShowToastEvent({
							title: 'Error',
							message: 'Error: ' + error.message,
							variant: 'error'
						})
					)
				});
				break;
		}
  }

  toLastHandler() {
		if(this.page !== this.totalPage) {
			this.page = this.totalPage;
			this.isNextLastDisabled = true;
			this.isPrevFirstDisabled = false;
			this.displayRecordPerPage(this.page);
		}
  }
 
  toFirstHandler() {
		if(this.page !== 1) {
			this.page = 1;
			this.isPrevFirstDisabled = true;
			this.isNextLastDisabled = false;
			this.displayRecordPerPage(this.page);
		}
   }
 
	toNextHandler() {
		if((this.page < this.totalPage) && (this.page !== this.totalPage)) {
			this.page = this.page + 1;
			if(this.page == this.totalPage) {
				this.isNextLastDisabled = true;
			}
			this.isPrevFirstDisabled = false;
			this.displayRecordPerPage(this.page);
		}
	}
 
	toPrevHandler() {
		if(this.page > 1) {
			this.page = this.page - 1;
			if(this.page == 1) {
				this.isPrevFirstDisabled = true;
			}
			this.isNextLastDisabled = false;
			this.displayRecordPerPage(this.page);
		}
	}

	comboboxChangeHandler(event) {
		this.showLoadingSpinner = true;
		this.pageSize = event.detail.value;
		this.setTable();
		this.refreshData();

		setTimeout(() => {
			this.showLoadingSpinner = false;
		 }, 400);
	}

	/* ======= Helper Functions ======= */

	setTable() {
		this.totalRecountCount = this.items.length;
		if(this.items.length == 0) {
			this.isNextLastDisabled = true;
			this.page = 0;
			this.totalPage = 0;
			return;
		}
		this.page = 1;
		this.totalPage = Math.ceil(this.totalRecountCount/this.pageSize);
		this.data = this.items.slice(0, this.pageSize);
		this.endingRecord = this.pageSize;
		if(this.totalPage == 1) {
			this.isNextLastDisabled = true;
		}
		else {
			this.isNextLastDisabled = false;
		}
	}

	displayRecordPerPage(page) {
		this.startingRecord = ((page - 1) * this.pageSize);
		this.endingRecord = (this.pageSize * page);
		this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord; 
		this.data = this.items.slice(this.startingRecord, this.endingRecord);
		this.startingRecord = this.startingRecord + 1;
	}

	refreshData() {
		return refreshApex(this.wiredDataResult);
	}
}