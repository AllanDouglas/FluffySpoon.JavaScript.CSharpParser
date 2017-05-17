"use strict";
var Models_1 = require("./Models");
var ScopeHelper_1 = require("./ScopeHelper");
var RegExHelper_1 = require("./RegExHelper");
var MethodParser_1 = require("./MethodParser");
var ClassParser = (function () {
    function ClassParser() {
        this.scopeHelper = new ScopeHelper_1.ScopeHelper();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.methodParser = new MethodParser_1.MethodParser();
    }
    ClassParser.prototype.parseClasses = function (content) {
        var classes = new Array();
        var scopes = this.scopeHelper.getScopes(content);
        for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
            var scope = scopes_1[_i];
            var matches = this.regexHelper.getMatches(scope.prefix, /class\s+(\w+?)\s*{/g);
            for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
                var match = matches_1[_a];
                var classObject = new Models_1.CSharpClass(match[0]);
                classObject.innerScopeText = scope.content;
                var methods = this.methodParser.parseMethods(scope.content);
                for (var _b = 0, methods_1 = methods; _b < methods_1.length; _b++) {
                    var method = methods_1[_b];
                    method.parent = classObject;
                    classObject.methods.push(method);
                }
                var subClasses = this.parseClasses(scope.content);
                for (var _c = 0, subClasses_1 = subClasses; _c < subClasses_1.length; _c++) {
                    var subClass = subClasses_1[_c];
                    subClass.parent = classObject;
                    classObject.classes.push(subClass);
                }
                classes.push(classObject);
            }
        }
        return classes;
    };
    return ClassParser;
}());
exports.ClassParser = ClassParser;
