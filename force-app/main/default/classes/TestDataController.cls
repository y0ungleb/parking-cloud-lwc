@isTest
private class TestDataController {
    @TestSetup
    static void setup(){
        List<Sensor__c> testSensors = new List<Sensor__c>();
        for(Integer i = 0; i < 10; i++) {
            testSensors.add(new Sensor__c (Status__c = 'Active'));
        }
        insert testSensors;
    }
    @isTest static void testGetSensorsList() {
        List<Sensor__c> sensors = new List<Sensor__c>();
        Test.startTest();
        sensors = DataController.getSensorsList();
        Test.stopTest();
        System.assertEquals(10, sensors.size());
    }

    @isTest static void testGetDefaultNumberRecordsPerPage() {
        Parking_Cloud_Setting__mdt cmt = new Parking_Cloud_Setting__mdt();
        Test.startTest();
        cmt = DataController.getDefaultNumberRecordsPerPage();
        Test.stopTest();
        System.assertEquals(true, cmt != null);
    }
}
