const getAllProperties = (object: any) => {
	const properties = new Set();

	do {
		for (const key of Reflect.ownKeys(object)) {
			properties.add([object, key]);
		}
	} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

	return properties;
};

// modified from https://www.npmjs.com/package/auto-bind
export default function autoBind(self) {
	getAllProperties(self.constructor.prototype).forEach((val) => {
		const [object, key]: [any, string] = [val[0], val[1]];

		if (key === 'constructor') {
			return;
		}

		const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
		if (descriptor && typeof descriptor.value === 'function') {
			self[key] = self[key].bind(self);
		}
	});

	return self;
}