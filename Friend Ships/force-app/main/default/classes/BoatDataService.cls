public with sharing class BoatDataService {

    //getBoatTypes()
    @AuraEnabled(cacheable = true)
    public static List<BoatType__c> getBoatTypes() 
    {
        return [SELECT Name, Id FROM BoatType__c WITH SECURITY_ENFORCED ORDER BY Name];
    } 

    //getBoats if boattypeid is mentioned then take the argument one else ignore the boattypeid
    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getBoats(String boatTypeId) 
    {
        String query = 'SELECT Name, Picture__c, Price__c, length__c, Geolocation__Longitude__s, Geolocation__Latitude__s, Description__c, BoatType__c, BoatType__r.Name, Contact__r.Name FROM Boat__c';

        if(String.isNotBlank(boatTypeId))
        {
            query += ' WHERE BoatType__c = :boatTypeId';
        }
        return Database.query(query);
    }

    //updateBoatList(object data)
    @AuraEnabled(cacheable = true)
    public static String updateBoatList(Object data)
    {
        List<Boat__c> boatstoUpdate = (List<Boat__c>) JSON.deserialize(
            JSON.serialize(data),
            List<Boat__c>.class
        );
        update boatstoUpdate;
        return 'Success : Ship it!';
    }

    //getboatsbylocation()
    //if boattypeid is mentioned then take the argument one else ignore the boattypeid
    @AuraEnabled(cacheable = true)
    public static String getBoatsByLocation(String boatTypeId, Decimal latitude, Decimal longitude)
    {
        String query = 'SELECT Name, Geolocation__Latitude__s, Geolocation__Latitude__s From Boat__c ';
        if(String.isNotBlank(boatTypeId))
        {
            query += 'WHERE BoatType__c = :boatTypeId';
        }
        query += ' WITH SECURITY_ENFORCED ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), \'mi\') LIMIT 10';
        return JSON.serialize(Database.query(query));
    }


    //getAllReviews()  
    /*fields ===> Boat__c, 
    Name, 
    Comment__c, 
    Rating__c, 
    LastModifiedById, 
    CreatedBy-------> Name, 
    CreatedBy---------->SmallPhotoUrl, 
    CreatedBy--------> CompanyName
    */
    @AuraEnabled
    public static List<BoatReview__c> getAllReviews(Id boatId)
    {
        return [SELECT Id, Name, Comment__c, Rating__c, LastModifiedDate, CreatedDate, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.CompanyName
                    FROM BoatReview__c 
                    WHERE Boat__c = :boatId 
                    WITH SECURITY_ENFORCED 
                    ORDER BY CreatedDate DESC];
    }




    public static final String PROPERTY_LENGTH = 'Length';
    public static final String PROPERTY_PRICE = 'Price';
    public static final String PROPERTY_TYPE = 'Type';

    //getSimilarBoats
    @AuraEnabled(cacheable = true)
    public static List<Boat__c> getSimilarBoats(Id boatId, String similarBy)
    {
        List<Boat__c> similarBoats = new List<Boat__c>();
        List<Boat__c> parentBoat = [SELECT Id, Length__c, Price__c, BoatType__c, BoatType__r.Name 
                                        FROM Boat__c 
                                        WHERE Id = :boatId 
                                        WITH SECURITY_ENFORCED];

        if(parentBoat.isEmpty())
        {
            return similarBoats;
        }

        if(similarBy == PROPERTY_LENGTH)
        {
            similarBoats = [SELECT Id, Contact__r.Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                                FROM Boat__c WHERE Id != :parentBoat.get(0).Id
                                AND (Length__c >= :parentBoat.get(0).Length__c/1.2)
                                AND (Length__c <= :parentBoat.get(0).Length__c*1.2)
                                WITH SECURITY_ENFORCED
                                ORDER BY Length__c, Price__c, Year_Built__c    
                            ];
        }
        else if(similarBy == PROPERTY_PRICE)
        {
            similarBoats = [SELECT Id, Contact__r.Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                                FROM Boat__c WHERE Id != :parentBoat.get(0).Id
                                AND(Price__c >= :parentBoat.get(0).Price__c/1.2)
                                AND(Price__c <= :parentBoat.get(0).Price__c*1.2)
                                WITH SECURITY_ENFORCED
                                ORDER BY Length__c, Price__c, Year_Built__c
                            ];
        }
        else if (similarBy == PROPERTY_TYPE)
        {
            similarBoats = [SELECT Id, Contact__r.Name, BoatType__c, BoatType__r.Name, Length__c, Picture__c, Price__c, Year_Built__c
                                FROM Boat__c WHERE Id != :parentBoat.get(0).Id
                                AND(BoatType__c = :parentBoat.get(0).BoatType__c)
                                WITH SECURITY_ENFORCED
                                ORDER BY Length__c, Price__c, Year_Built__c
                            ];
        }
        return similarBoats;
    }

}