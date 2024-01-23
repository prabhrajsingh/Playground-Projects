import { createElement } from '@lwc/engine-dom'; //it imports the createElement method from the lwc framework its only to get a passing test.
import UnitTest from 'c/unitTest'; // imports the unittest class from the component javascript controller.

describe('c-unit-test', () => {   //test suite block
    afterEach(() => {  // afterEach() is one of jest's setup and cleanup methods. it runs after each test in the describe block.
        //this method resets the DOM at the end of the test.

        //jest uses jsdom to provide an environment that behaves much like a browser's DOM or document.
        //the jsdom instance is shared across test cases in a single file so reset the DOM
        while(document.body.firstChild)
        {
            document.body.removeChild(document.body.firstChild);
        }
    });

    //it is an alias for test
    it('displays unit status with default unitNumber', () => {

        //to use the createElement it creates an instance of the component and assigns it to the constant element.
        const element = createElement('c-unit-test', {
            is: UnitTest
        });

        //this is the first requirement that we are testing for that unitnumber is set to 5 first.
        expect(element.unitNumber).toBe(5);


        // add the element to the jsdom version of document.body using the appendchild method.

        /*
            the call attaches the lightning web component to the DOM and renders it, 
            which also means the lifecycle hooks 
                                            connectedCallback() and 
                                            renderedCallback() are called.
                */
        document.body.appendChild(element);


        //verify displayed greeting
        //using querySelect(A STANDARD DOM QUERY METHOD) to seach the DOM for a div tag.
        //using element.shadowRoot as the parent query
        //its a test-only API that lets you peek across the shadow boundary to inspect a component's shadow tree.
        const div = element.shadowRoot.querySelector('div');

        //expect is looking at the textContent of the div tag to assert 'Unit 5 alive!' is there.
        expect(div.textContent).toBe('Unit 5 alive!');
    });


    it('displays unit status with updated unitNumber', () => {
        const element = createElement('c-unit-test', {
         is: UnitTest
        });
        // Add the element to the jsdom instance
        document.body.appendChild(element);
        // Update unitNumber after element is appended
        element.unitNumber = 6
          
        const div = element.shadowRoot.querySelector('div');
        // Verify displayed unit status
        expect(div.textContent).not.toBe('Unit 6 alive!');
    
        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
          expect(div.textContent).toBe('Unit 6 alive!');
        });
      }); 
      
      
      it('displays unit status with input change event', () => {
        const element = createElement('c-unit-test', {
          is: UnitTest
        });
        document.body.appendChild(element);
        const div = element.shadowRoot.querySelector('div');
          
        // Trigger unit status input change
        const inputElement = element.shadowRoot.querySelector('lightning-input');
        inputElement.value = 7;
        inputElement.dispatchEvent(new CustomEvent('change'));
          
        return Promise.resolve().then(() => {
          expect(div.textContent).toBe('Unit 7 alive!');
        });
      });
});

