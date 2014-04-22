'use strict';
/* global angular, describe, it, beforeEach, expect, inject */

describe('The directive zenBreadcrumb', function() {

    var element, scope;

    beforeEach(function() {
        module('zen-breadcrumb');
    });

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<div zen-breadcrumb></div>');
        var compile = $compile(element);
        scope = $rootScope.$new();
        compile(scope);
        scope.$digest();
    }));

    it('is compiled', function() {
        expect(element.text()).toContain('Zen breadcrumb');
    });

});
