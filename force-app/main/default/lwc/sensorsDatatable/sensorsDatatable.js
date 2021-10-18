import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import csvFileRead from '@salesforce/apex/UploadController.csvFileRead';
//import importRecordsFromFile from '@salesforce/apex/UploadController.importRecordsFromFile';

const actions = [
		{ label: 'Show details', name: 'show_details' },
	 	{ label: 'Delete', name: 'delete' }
];

export default class SensorsDatatable extends LightningElement {
	// @api recordid;
	// @track data;
	// @track showLoadingSpinner = false;
	// MAX_CSV_SIZE = 1500000;
	// fileUploaded;
	// fileUploadedName;
	// fileReader;
	// fileContents;
	// file;

	columnsAccount = [
		{ label: 'Assigned Base Station', fieldName: 'Base_Station__c', type: 'text'},
		{ label: 'Status', fieldName: 'Status__c', type: 'url', type: 'text' },
		{ label: 'Sesnor Model', fieldName: 'Sensor_Model__c', type: 'text' },
		{ label: 'Actions', type: 'action', typeAttributes: { rowActions: actions }}
	];

	

	@api recordId;
    @track error;
    @track data;


	

	testData = [
		{
			Sensor_Model__c: "XC5",
			Status__c : "Active",
			Base_Station__c : "Masherova 19 Minsk"
		},
		{
			Sensor_Model__c: "XC6",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 35 Minsk"
		},
		{
			Sensor_Model__c: "XC7",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 100 Minsk"
		},
		{
			Sensor_Model__c: "XC7",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 100 Minsk"
		},
		{
			Sensor_Model__c: "XC7",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 100 Minsk"
		},
		{
			Sensor_Model__c: "XC7",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 100 Minsk"
		},
		{
			Sensor_Model__c: "XC7",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 100 Minsk"
		},
		{
			Sensor_Model__c: "XC7",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 100 Minsk"
		},
		{
			Sensor_Model__c: "XC7",
			Status__c : "Inactive",
			Base_Station__c : "Masherova 100 Minsk"
		}
	];

	// handleUpload(event) {
	// 	this.fileUploaded = event.target.files;
	// 	this.fileUploadedName = event.target.files[0].name;
	// 	console.log("handleUpload - success");
	// }

	// handleInsert() {
	// 	if(this.fileUploaded.length > 0) {
	// 		console.log("handleInsert - success");
	// 		this.uploadHelper();
	// 	}
	// 	else {
	// 		console.log("file length - fail");
	// 		//Toast message
	// 	}
	// }

	// uploadHelper() {
	// 	console.log("upload helper started");
	// 	this.file = this.fileUploaded;
	// 	if(this.file.length > this.MAX_CSV_SIZE) {
	// 		//Toast message
	// 		console.log("file max size - fail");
	// 		return;
	// 	}
	// 	else {
	// 		console.log("file has normal size");
	// 		//this.showLoadingSpinner = true;
	// 		this.fileReader = new FileReader();
	// 		console.log("FileReader created");
	// 		this.fileReader.onloadend = (() => {
	// 			console.log("arrow function onloadend");
	// 			this.fileContents = this.fileReader.result;
	// 			console.log("save to file ready to execute");
	// 			this.saveToFile();
	// 			console.log("uploadHelper - success");
	// 		});

	// 		this.fileReader.readAsText(this.file);
	// 	}
	// }

	// saveToFile() {
	// 	importRecordsFromFile({rawData: JSON.stringify(this.fileContents), cdbId: this.recordid})
	// 	.then(result => {
	// 		this.data = result;
	// 		//this.showLoadingSpinner = false;
	// 		console.log("saveToFile - success");
	// 		// this.dispatchEvent(
	// 		// 	console.log("saveToFile - success");
	// 		// 	//Toast event
	// 		// );
	// 	})

	// 	.catch(error => {
	// 		console.log("saveToFile - error");
	// 		// this.dispatchEvent(
	// 		// 	//Toast event
	// 		// )
	// 	});
	// }

	get acceptedCSVFormats() {
		return ['.csv'];
  }
  
  uploadFileHandler(event) {
		// Get the list of records from the uploaded files
		const uploadedFiles = event.detail.files;

		// calling apex class csvFileread method
		csvFileRead({contentDocumentId : uploadedFiles[0].documentId})
		.then(result => {
			 window.console.log('result ===> '+result);
			 this.data = result;
			 this.dispatchEvent(
				  new ShowToastEvent({
						title: 'Success!!',
						message: 'Accounts are created according to the CSV file upload!!!',
						variant: 'Success',
				  }),
			 );
		})
		.catch(error => {
			 this.error = error;
			 console.log(this.error);
			 this.dispatchEvent(
				  new ShowToastEvent({
						title: 'Error Here!',
						message: JSON.stringify(error),
						variant: 'error',
				  }),
			 );     
		})

  }

  onRowActionHandler() {

  }

  toLastHandler() {

  }

  toFirstHandler() {

  }

  toNextHandler() {

  }

  toPrevHandler() {
	  
  }

}