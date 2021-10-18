import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import importRecordsFromFile from '@salesforce/apex/UploadController.importRecordsFromFile';

export default class SensorsDatatable extends LightningElement {
	@track showLoadingSpinner = false;
	MAX_CSV_SIZE = 1500000;
	fileUploaded;
	fileUploadedName;
	file;


	columns = [
		{ label: 'Sesnor Model', fieldName: 'Sensor_Model__c', type: 'text' },
		{ label: 'Status', fieldName: 'Status__c', type: 'url', type: 'text' },
		{ label: 'Assigned Base Station', fieldName: 'Base_Station__c', type: 'text'}
	];

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
		}
	];

	handleUpload(event) {
		this.fileUploaded = event.target.files;
		this.fileUploadedName = event.target.files.name;
	}

	handleInsert() {

	}
}