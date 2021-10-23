public with sharing class DataController {

    @AuraEnabled(cacheable=true)
    public static Parking_Cloud_Setting__mdt getDefaultNumberRecordsPerPage() {
        return [SELECT Def_Rec_Per_Page__c FROM Parking_Cloud_Setting__mdt WHERE Label = 'Parking Cloud 1.0'];
    }

    @AuraEnabled(cacheable=true)
    public static List<Sensor__c> getSensorsList() {
        return [SELECT Id, Name, Base_Station__c, Base_Station__r.Name, Base_Station_Name__c, Status__c, Sensor_Model__c FROM Sensor__c];
    }
}
