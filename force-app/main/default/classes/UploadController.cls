public with sharing class UploadController {

    @AuraEnabled
    public static List<Sensor__c> csvFileRead(String contentDocumentId){
        List<Sensor__c> accountInsertList = new List<Sensor__c>();
        Id testId = Id.valueOf(contentDocumentId);
        if(contentDocumentId != null) {
            
            // Fetch File Data based on the basic of document id 
            ContentVersion contentVersionObj = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId = :testId];
            // split the file data
            List<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');

            for(Integer i = 1; i < csvRecordsList.size(); i++){
                Sensor__c sensorObj = new Sensor__c();
                List<String> csvRowData = csvRecordsList[i].split(',');
                System.debug('csvRowData====> '+csvRowData);
                sensorObj.Base_Station__c = csvRowData[0]; // accName
                sensorObj.Status__c = csvRowData[1];
                sensorObj.Sensor_Model__c = csvRowData[2];
                accountInsertList.add(sensorObj);
            }

            try{    
                if(!accountInsertList.isEmpty()) {
                    insert accountInsertList;
                }
            }
            catch (Exception ex) {
                throw new AuraHandledException(ex.getMessage());
            } 
        }
        return accountInsertList;    
    }
}
