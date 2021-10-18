public with sharing class UploadController {

    // @AuraEnabled
    // public static List<Sensor__c> importRecordsFromFile(String rawData) {

    //     String data = JSON.deserializeUntyped(rawData).toString();

    //     List<Sensor__c> recordsToInsert = new List<Sensor__c>();
    //     List<String> CSVAllLines = data.split('\n');

    //     for (Integer i = 1; i < CSVAllLines.size(); i++) {
    //         Sensor__c sensor = new Sensor__c();

    //         String CSVLine = CSVAllLines[i];
    //         String prevCSVLine = CSVLine;
    //         Integer startIndex;
    //         Integer endIndex;

    //         while(CSVLine.indexOf('"') > -1) {
            
    //             if(startIndex == null) {
    //                 startIndex = CSVLine.indexOf('"');
    //                 CSVLine = CSVLine.substring(0, startIndex) + ':quotes:' + CSVLine.substring(startIndex+1, CSVLine.length());
    //             }
    //             else {
    //                 if(endIndex == null){
    //                     endIndex = CSVLine.indexOf('"');
    //                     CSVLine = CSVLine.substring(0, endIndex) + ':quotes:' + CSVLine.substring(endIndex+1, CSVLine.length());
    //                 }
    //             }
                
    //             if(startIndex != null && endIndex != null) {
    //                 String sub = CSVLine.substring(startIndex, endIndex);
    //                 sub = sub.replaceAll(',', ':comma:');
    //                 CSVLine = CSVLine.substring(0, startIndex) + sub + CSVLine.substring(endIndex, CSVLine.length());
    //                 startIndex = null;
    //                 endIndex = null;
    //             }
    //         }

    //         List<String> CSVRowData = new List<String>();

    //         for(String column : CSVLine.split(',')){
    //             column = column.replaceAll(':quotes:', '').replaceAll(':comma:', ',');
    //             CSVRowData.add(column);
    //         }

    //         sensor.Base_Station__c = CSVRowData[0];
    //         sensor.Status__c = CSVRowData[1];
    //         sensor.Sensor_Model__c = CSVRowData[2];

    //         recordsToInsert.add(sensor);
    //     }
    //     insert recordsToInsert;
    //     return recordsToInsert;
    // }

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
