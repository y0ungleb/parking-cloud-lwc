public with sharing class UploadController {

    @AuraEnabled
    public static void csvFileRead(String contentDocumentId){
        List<Sensor__c> sensorInsertList = new List<Sensor__c>();
        List<Base_Station__c> baseStations = new List<Base_Station__c>();
        baseStations = [SELECT Id, Name FROM Base_Station__c];
        Id docId = Id.valueOf(contentDocumentId);
        if(contentDocumentId != null) {
            
            ContentVersion contentVersionObj = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId = :docId];
            List<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');
            Boolean bsExists = true;

            for(Integer i = 1; i < csvRecordsList.size(); i++){
                Sensor__c sensorObj = new Sensor__c();
                List<String> csvRowData = csvRecordsList[i].split(',');
                for(Base_Station__c baseIt : baseStations) {
                    if(csvRowData[0] == baseIt.Name) {
                        sensorObj.Base_Station__c = baseIt.Id;
                    }
                }
                sensorObj.Status__c = csvRowData[1];
                sensorObj.Sensor_Model__c = csvRowData[2];
                sensorInsertList.add(sensorObj);
            }
            
            for(Sensor__c senIt : sensorInsertList) {
                if(senIt.Base_Station__c == null) {
                    bsExists = false;
                }
            }

            if(!bsExists) {
                throw new AuraHandledException('Unknown Base Station in file');
            }

            if(!sensorInsertList.isEmpty()) {
                insert sensorInsertList;
            }
            else {
                throw new AuraHandledException('Invalid file');
            }
        }    
    }
}
