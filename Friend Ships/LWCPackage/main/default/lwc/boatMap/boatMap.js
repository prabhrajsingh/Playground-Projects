import { LightningElement, api, wire } from 'lwc';

import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { APPLICATION_SCOPE, MessageContext, subscribe } from 'lightning/messageService';
import { getRecord } from 'lightning/uiRecordApi';



import LONGITUDE_FIELD from '@salesforce/schema/Boat__c.Geolocation__c';
import LATITUDE_FIELD from '@salesforce/schema/Boat__c.Geolocation__c';

const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];


export default class BoatMap extends LightningElement 
{
    
    subscription = null;
    boatId;

    @api
    get recordId()
    {
        return this.boatId;
    }

    set recordId(value)
    {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    error = undefined;
    mapMarkers = [];

    @wire(MessageContext)
    messageContext;


    @wire(getRecord, {recordId: '$boatId', fields: BOAT_FIELDS} )
    wiredRecord( { error, data })
    {
        if(data)
        {
            this.error = undefined;

            const longitude = data.fields.Geolocation__Longitude__s.value;
            const latitude = data.fields.Geolocation__Latitude__s.value;

            this.updateMap(latitude, longitude);
        }
        else if(error)
        {
            this.error = error;
            this.boatId = undefined;
            this.mapMarkers = [];
        }
    }
    subscribeMC()
    {
        this.subscription = subscribe( this.messageContext, BOATMC, (message) => { this.boatId = message.recordId }, { scope : APPLICATION_SCOPE });
    }

    connectedCallback() 
    {
        if(this.subscription || this.recordId)
        {
            return;
        }
        this.subscribeMC();
    }


    updateMap(latitude, longitude)
    {
        this.mapMarkers = [{location: {latitude, longitude}}];
    }


    get showMap()
    {        return this.mapMarkers.length > 0;     }

    
}