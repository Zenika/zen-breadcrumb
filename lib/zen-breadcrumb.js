/*
 * zen-breadcrumb
 * https://github.com/Zenika/zen-breadcrumb
 *
 * Copyright (c) 2014 Nicolas Cuillery
 * Licensed under the MIT license.
 */

angular.module('zen-breadcrumb', ['ui.router.state'])
    .directive('zenBreadcrumb', function() {
        return {
            scope: {},
            link: {
                post: function postLink(scope, element) {
                    element.text('Zen breadcrumb');
                }
            }
        };
    });
