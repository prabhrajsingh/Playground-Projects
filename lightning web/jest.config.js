const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    moduleNameMapper: 
    {
        '^lightning/button$': '<rootDir>/force-app/test/jest-mocks/lightning/button',
        //this is telling jest where to find the stub for lightning-button.
        //the first dash is converted to a forward slash and the rest of the component name goes from kebab to camel case.
        //the reason for the forward slash is because the module resolver treats everything before the first dash as the namespace.
        //here, <rootDir> maps to the root of the Salesforce DX workspace.
        '^thunder/hammerButton$': '<rootDir>/force-app/test/jest-mocks/thunder/hammerButton',
        '^c/displayPanel$': '<rootDir>/force-app/test/jest-mocks/c/displayPanel'
    },
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver']
};
