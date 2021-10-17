import { LightningElement } from 'lwc';

const columns = [
	{ label: 'Sesnor Model', fieldName: 'Sensor_Model__c' },
	{ label: 'Status', fieldName: 'Status__c', type: 'url' },
	{ label: 'Assigned Base Station', fieldName: 'Base_Station__c'},
];

export default class SensorsDatatable extends LightningElement {}