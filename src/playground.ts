import * as TriggerFuncs from './triggers/TriggerFuncs';

const triggerFuncInFile = (): boolean => {
	return true;
};

const triggerFuncInFileCopy = (): boolean => {
	return true;
};

let fnMap: { [key: string]: () => boolean } = {
	foo: triggerFuncInFile,
	bar: triggerFuncInFileCopy,
	ext: TriggerFuncs.triggerFuncTrue
};

// console.log(fnMap['foo']);
// console.log(fnMap['bar']);
// console.log(fnMap['ext']);

let fnRecord: Record<string, () => boolean> = {
	foo: triggerFuncInFile,
	bar: triggerFuncInFileCopy,
	ext: TriggerFuncs.triggerFuncTrue
};

// console.log(fnRecord['foo']);
// console.log(fnRecord['bar']);
// console.log(fnRecord['ext']);

let strFunc = fnRecord['foo'];

// if (typeof window['triggerFuncInFile'] === 'function') {
// 	console.log('function matched to string');
// 	//window[strOfFunction](); //To call the function dynamically!
// } else {
// 	console.log('function NOT matched to string');
// }

// VERSION 1

// var obj: { [key: string]: string } = {
// 	sayHello: function () {
// 		console.log('I say Hello!');
// 	}.toString(),
// 	sayHi: function () {
// 		console.log('I say Hi!');
// 	}.toString()
// };
// var myobj = JSON.parse(JSON.stringify(obj));
// myobj.sayHello = new Function('return (' + myobj.sayHello + ')')();
// myobj.sayHello();
// console.log(typeof myobj.sayHello);

// for (var func in myobj) {
// 	console.log(func);
// 	myobj.funcTransform = new Function('return (' + myobj.func + ')')();
// 	console.log(typeof myobj.funcTransfrom);
// 	myobj.funcTransform();
// }

// VERSION 2

var obj: { [key: string]: () => boolean } = {
	sayHello: function () {
		console.log('I say Hello!');
		return true;
	},
	sayHi: function () {
		console.log('I say Hi!');
		return true;
	}
};

for (var func in obj) {
	console.log(func);
}

let getTriggerFunc = (triggerStr: string): (() => boolean) | false => {
	for (let funcName in TriggerFuncs.funcDict) {
		if (triggerStr === funcName) {
			console.log(typeof TriggerFuncs.funcDict[funcName]);
			return TriggerFuncs.funcDict[funcName];
		}
	}
	return false;
};

console.log(getTriggerFunc('triggerFuncFalse'));
