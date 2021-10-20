public with sharing class DataController {

    @AuraEnabled(cacheable=true)
    public static Parking_Cloud_Setting__mdt getDefaultNumberRecordsPerPage() {
        return [SELECT Def_Rec_Per_Page__c FROM Parking_Cloud_Setting__mdt WHERE Label = 'Parking Cloud 1.0'];
    }

    @AuraEnabled(cacheable=true)
    public static List<Sensor__c> getSensorsList() {
        return [SELECT Id, Name, Base_Station__r.Name, Status__c, Sensor_Model__c FROM Sensor__c];
    }

    // @AuraEnabled(cacheable=true)
    // public static List<Base_Station__c> getBaseStationName() {
    //     List<Base_Station__c> baseStationList =  [SELECT Id, Name FROM Base_Station__c];
    //     List<String> baseStationId = [SELECT Base_Station__c FROM Sensor__c];
    // }
}
