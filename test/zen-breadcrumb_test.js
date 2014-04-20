'use strict';
/* global angular, describe, it, beforeEach, expect, inject */

describe('The module zen-breadcrumb', function() {

    beforeEach(function() {
        module('zen-breadcrumb');
    });

    it('is loaded', function() {
        var zenBreadcrumb = angular.module('zen-breadcrumb');
        expect(zenBreadcrumb.name).toBe('zen-breadcrumb');
    });

    it('has a $state service', inject(function($state) {
        expect($state).toBeDefined();
    }));

});
