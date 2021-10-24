@isTest
private class TestUploadController {
    @TestSetup
    static void setup(){
        ContentVersion testContentVersionValid = new ContentVersion();
        testContentVersionValid.Title = 'Test Document Valid';
        testContentVersionValid.VersionData = Blob.valueOf('Base Station,Status,Sensor model\nGikalo 9 Minsk,Active,PS01.3\nDzerzhinskogo 104 Minsk,Active,PS01.3\nMasherova 19 Minsk,Active,PS01.3\nMount Street 46 Dublin,Active,PS01.3\nZelena 115 Lviv,Active,PS01.3');
        testContentVersionValid.PathOnClient = 'sensorsTestData_5.csv';
        insert testContentVersionValid;

        ContentVersion testContentVersionInvalid = new ContentVersion();
        testContentVersionInvalid.Title = 'Test Document Invalid';
        testContentVersionInvalid.VersionData = Blob.valueOf('some invalid data ahhahahahaha 23324 23532532 26 62');
        testContentVersionInvalid.PathOnClient = 'uploadErrorTest_Invalid.csv';
        insert testContentVersionInvalid;

        ContentVersion testContentVersionUnkBs = new ContentVersion();
        testContentVersionUnkBs.Title = 'Test Document Unknown BS';
        testContentVersionUnkBs.VersionData = Blob.valueOf('Base Station,Status,Sensor model\nKalvariyskaya 60 Minsk,Active,PS01.3\nDzerzhinskogo 104 Minsk,Active,PS01.3\nMasherova 19 Minsk,Active,PS01.3\nMount Street 46 Dublin,Active,PS01.3\nZelena 115 Lviv,Active,PS01.3');
        testContentVersionUnkBs.PathOnClient = 'sensorsTestData_5_UnknownBS.csv';
        insert testContentVersionUnkBs;
    }
    @isTest static void testCsvFileReadValid() {
        ContentVersion testDocumentValid = [SELECT Id, VersionData, ContentDocumentId FROM ContentVersion WHERE Title = 'Test Document Valid'];
        List<Sensor__c> insertedSensors = new List<Sensor__c>();
        Test.startTest();
        UploadController.csvFileRead(testDocumentValid.ContentDocumentId);
        Test.stopTest();
        insertedSensors = [SELECT Id, Status__c, Sensor_Model__c FROM Sensor__c];
        System.debug(insertedSensors);
        System.assertEquals(5, insertedSensors.size());
    }

    @isTest static void testCsvFileReadInvalid() {
        ContentVersion testDocumentInvalid = [SELECT Id, VersionData, ContentDocumentId FROM ContentVersion WHERE Title = 'Test Document Invalid'];
        Boolean exceptionThrown;
        Test.startTest();
        try {
            UploadController.csvFileRead(testDocumentInvalid.ContentDocumentId);
        } catch (AuraHandledException ex) {
            exceptionThrown = true;
        }
        Test.stopTest();
        System.assert(exceptionThrown);
    }

    @isTest static void testCsvFileReadUnkBs() {
        ContentVersion testDocumentUnkBs = [SELECT Id, VersionData, ContentDocumentId FROM ContentVersion WHERE Title = 'Test Document Unknown BS'];
        Boolean exceptionThrown;
        Test.startTest();
        try {
            UploadController.csvFileRead(testDocumentUnkBs.ContentDocumentId);
        } catch (AuraHandledException ex) {
            exceptionThrown = true;
        }
        Test.stopTest();
        System.assert(exceptionThrown);
    }
}
