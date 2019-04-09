"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process = require("child_process");
var pidtree = require("pidtree");
var ide_settings = require("./IDESettings");
// this module monitors the linux-domain CPU usage of a running bela process
// once it has found the correct pid it calls the callback passed to start()
// every second with the cpu usage as a parameter
var name;
var timeout;
var found_pid;
var root_pid;
var main_pid;
var callback;
var stopped;
var find_pid_count;
function start(pid, project, cb) {
    root_pid = pid;
    // the process name gets cut off at 15 chars
    console.log("typeof(project): ", typeof (project), "project: ", project);
    if (typeof (project) === "object") {
        project = project.join("");
    }
    else if (typeof (project) !== "string") {
        project = "";
    }
    name = project.substring(0, 15) || project[0].substring(0, 15);
    callback = cb;
    stopped = false;
    found_pid = false;
    find_pid_count = 0;
    timeout = setTimeout(function () { return timeout_func(); }, 1000);
}
exports.start = start;
function stop() {
    if (timeout)
        clearTimeout(timeout);
    stopped = true;
}
exports.stop = stop;
// this function keeps trying every second to find the correct pid
// once it has, it uses ps to get the cpu usage, and calls the callback
function timeout_func() {
    return __awaiter(this, void 0, void 0, function () {
        var cpu, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ide_settings.get_setting('cpuMonitoring')];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    cpu = '0';
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, 9, 10]);
                    if (!!found_pid) return [3 /*break*/, 5];
                    if (!(find_pid_count++ < 3)) return [3 /*break*/, 4];
                    return [4 /*yield*/, find_pid()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, getCPU()];
                case 6:
                    cpu = _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1 = _a.sent();
                    console.log('Failed to get CPU usage');
                    found_pid = false;
                    return [3 /*break*/, 10];
                case 9:
                    if (!stopped) {
                        callback(cpu);
                        timeout = setTimeout(timeout_func, 1000);
                    }
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function find_pid() {
    return __awaiter(this, void 0, void 0, function () {
        var pids, _i, pids_1, pid, test_name;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pidtree(root_pid, { root: true })];
                case 1:
                    pids = _a.sent();
                    _i = 0, pids_1 = pids;
                    _a.label = 2;
                case 2:
                    if (!(_i < pids_1.length)) return [3 /*break*/, 5];
                    pid = pids_1[_i];
                    return [4 /*yield*/, name_from_pid(pid)];
                case 3:
                    test_name = (_a.sent()).trim();
                    if (test_name === name) {
                        main_pid = pid;
                        found_pid = true;
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// returns the name of the process corresponding to the pid passed in to it
function name_from_pid(pid) {
    return new Promise(function (resolve, reject) {
        child_process.exec('ps -p ' + pid + ' -o comm=', function (err, stdout) {
            if (err)
                reject(err);
            resolve(stdout);
        });
    });
}
function getCPU() {
    return new Promise(function (resolve, reject) {
        child_process.exec('ps -p ' + main_pid + ' -o %cpu --no-headers', function (err, stdout) {
            if (err)
                reject(err);
            resolve(stdout);
        });
    });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QVgsR0FBRztvQkFDTSxxQkFBTSxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUE7O29CQUFyQyxTQUFTLEdBQUcsQ0FBQyxTQUFtQyxDQUFBLENBQUMsSUFBSSxFQUFFO29CQUMzRCxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUM7d0JBQ3RCLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBQ2YsU0FBUyxHQUFHLElBQUksQ0FBQztxQkFDakI7OztvQkFMYyxJQUFJLENBQUE7Ozs7OztDQU9wQjtBQUVELDJFQUEyRTtBQUMzRSx1QkFBdUIsR0FBVztJQUNqQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDbEMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUMsR0FBRyxHQUFDLFdBQVcsRUFBRSxVQUFDLEdBQUcsRUFBRSxNQUFNO1lBQ3hELElBQUksR0FBRztnQkFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQ7SUFDQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDbEMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUMsUUFBUSxHQUFDLHVCQUF1QixFQUFFLFVBQUMsR0FBRyxFQUFFLE1BQU07WUFDekUsSUFBSSxHQUFHO2dCQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMiLCJmaWxlIjoiQ1BVTW9uaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBwaWR0cmVlIGZyb20gJ3BpZHRyZWUnO1xuaW1wb3J0ICogYXMgaWRlX3NldHRpbmdzIGZyb20gJy4vSURFU2V0dGluZ3MnO1xuXG4vLyB0aGlzIG1vZHVsZSBtb25pdG9ycyB0aGUgbGludXgtZG9tYWluIENQVSB1c2FnZSBvZiBhIHJ1bm5pbmcgYmVsYSBwcm9jZXNzXG4vLyBvbmNlIGl0IGhhcyBmb3VuZCB0aGUgY29ycmVjdCBwaWQgaXQgY2FsbHMgdGhlIGNhbGxiYWNrIHBhc3NlZCB0byBzdGFydCgpXG4vLyBldmVyeSBzZWNvbmQgd2l0aCB0aGUgY3B1IHVzYWdlIGFzIGEgcGFyYW1ldGVyXG5cbmxldCBuYW1lOiBzdHJpbmc7XG5sZXQgdGltZW91dDogTm9kZUpTLlRpbWVyO1xubGV0IGZvdW5kX3BpZDogYm9vbGVhbjtcbmxldCByb290X3BpZDogbnVtYmVyO1xubGV0IG1haW5fcGlkOiBudW1iZXI7XG5sZXQgY2FsbGJhY2s6IChjcHU6IGFueSkgPT4gdm9pZDtcbmxldCBzdG9wcGVkOiBib29sZWFuO1xubGV0IGZpbmRfcGlkX2NvdW50OiBudW1iZXI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydChwaWQ6IG51bWJlciwgcHJvamVjdDogc3RyaW5nLCBjYjogKGNwdTogYW55KT0+dm9pZCl7XG5cdHJvb3RfcGlkID0gcGlkO1xuXHQvLyB0aGUgcHJvY2VzcyBuYW1lIGdldHMgY3V0IG9mZiBhdCAxNSBjaGFyc1xuXHRjb25zb2xlLmxvZyhcInR5cGVvZihwcm9qZWN0KTogXCIsIHR5cGVvZihwcm9qZWN0KSwgXCJwcm9qZWN0OiBcIiwgcHJvamVjdCk7XG5cdGlmKHR5cGVvZihwcm9qZWN0KSA9PT0gXCJvYmplY3RcIikge1xuXHRcdHByb2plY3QgPSBwcm9qZWN0LmpvaW4oXCJcIik7XG5cdH0gZWxzZSBpZiAodHlwZW9mKHByb2plY3QpICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0cHJvamVjdCA9IFwiXCI7XG5cdH1cblx0bmFtZSA9IHByb2plY3Quc3Vic3RyaW5nKDAsIDE1KSB8fCBwcm9qZWN0WzBdLnN1YnN0cmluZygwLCAxNSk7XG5cdGNhbGxiYWNrID0gY2I7XG5cdHN0b3BwZWQgPSBmYWxzZTtcblx0Zm91bmRfcGlkID0gZmFsc2U7XG5cdGZpbmRfcGlkX2NvdW50ID0gMDtcblx0dGltZW91dCA9IHNldFRpbWVvdXQoICgpID0+IHRpbWVvdXRfZnVuYygpLCAxMDAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0b3AoKXtcblx0aWYgKHRpbWVvdXQpIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblx0c3RvcHBlZCA9IHRydWU7XG59XG5cbi8vIHRoaXMgZnVuY3Rpb24ga2VlcHMgdHJ5aW5nIGV2ZXJ5IHNlY29uZCB0byBmaW5kIHRoZSBjb3JyZWN0IHBpZFxuLy8gb25jZSBpdCBoYXMsIGl0IHVzZXMgcHMgdG8gZ2V0IHRoZSBjcHUgdXNhZ2UsIGFuZCBjYWxscyB0aGUgY2FsbGJhY2tcbmFzeW5jIGZ1bmN0aW9uIHRpbWVvdXRfZnVuYygpe1xuXHRpZiAoIShhd2FpdCBpZGVfc2V0dGluZ3MuZ2V0X3NldHRpbmcoJ2NwdU1vbml0b3JpbmcnKSkpXG5cdFx0cmV0dXJuO1xuXHRsZXQgY3B1OiBhbnkgPSAnMCc7XG5cdHRyeXtcblx0XHRpZiAoIWZvdW5kX3BpZCl7XG5cdFx0XHRpZiAoZmluZF9waWRfY291bnQrKyA8IDMpe1xuXHRcdFx0XHRhd2FpdCBmaW5kX3BpZCgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcHUgPSBhd2FpdCBnZXRDUFUoKTtcblx0XHR9XG5cdH1cblx0Y2F0Y2goZSl7XG5cdFx0Y29uc29sZS5sb2coJ0ZhaWxlZCB0byBnZXQgQ1BVIHVzYWdlJyk7IFxuXHRcdGZvdW5kX3BpZCA9IGZhbHNlO1xuXHR9XG5cdGZpbmFsbHl7XG5cdFx0aWYoIXN0b3BwZWQpe1xuXHRcdFx0Y2FsbGJhY2soY3B1KTtcblx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KHRpbWVvdXRfZnVuYywgMTAwMCk7XG5cdFx0fVxuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbmRfcGlkKCl7XG5cdC8vIHVzZSBwaWR0cmVlIHRvIGZpbmQgYWxsIHRoZSBjaGlsZCBwaWRzIG9mIHRoZSByb290IHByb2Nlc3Ncblx0bGV0IHBpZHMgPSBhd2FpdCBwaWR0cmVlKHJvb3RfcGlkLCB7cm9vdDogdHJ1ZX0pO1xuXHQvLyBsb29rIHRocm91Z2ggdGhlIHBpZHMgdG8gc2VlIGlmIGFueSBvZiB0aGVtIGJlbG9uZyB0byBhIHByb2Nlc3Mgd2l0aCB0aGUgcmlnaHQgbmFtZVxuXHRmb3IgKGxldCBwaWQgb2YgcGlkcyl7XG5cdFx0bGV0IHRlc3RfbmFtZSA9IChhd2FpdCBuYW1lX2Zyb21fcGlkKHBpZCkgYXMgc3RyaW5nKS50cmltKCk7XG5cdFx0aWYgKHRlc3RfbmFtZSA9PT0gbmFtZSl7XG5cdFx0XHRtYWluX3BpZCA9IHBpZDtcblx0XHRcdGZvdW5kX3BpZCA9IHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbi8vIHJldHVybnMgdGhlIG5hbWUgb2YgdGhlIHByb2Nlc3MgY29ycmVzcG9uZGluZyB0byB0aGUgcGlkIHBhc3NlZCBpbiB0byBpdFxuZnVuY3Rpb24gbmFtZV9mcm9tX3BpZChwaWQ6IG51bWJlcil7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0Y2hpbGRfcHJvY2Vzcy5leGVjKCdwcyAtcCAnK3BpZCsnIC1vIGNvbW09JywgKGVyciwgc3Rkb3V0KSA9PiB7XG5cdFx0XHRpZiAoZXJyKSByZWplY3QoZXJyKTtcblx0XHRcdHJlc29sdmUoc3Rkb3V0KTtcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldENQVSgpe1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGNoaWxkX3Byb2Nlc3MuZXhlYygncHMgLXAgJyttYWluX3BpZCsnIC1vICVjcHUgLS1uby1oZWFkZXJzJywgKGVyciwgc3Rkb3V0KSA9PiB7XG5cdFx0XHRpZiAoZXJyKSByZWplY3QoZXJyKTtcblx0XHRcdHJlc29sdmUoc3Rkb3V0KTtcblx0XHR9KTtcblx0fSk7XG59XG4iXX0=
