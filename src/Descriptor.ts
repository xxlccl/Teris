export function classDescriptor(description: string) {
    return function (target: Function) {
        target.prototype.$classDescription = description;
    };
}

export function propDescriptor(description: string) {
    return function (target: any, propertyKey: string) {
        if (!target.$propDescriptions) {
            target.$propDescriptions = [];
        }
        target.$propDescriptions.push({
            propertyKey,
            description,
        });
    };
}

export function printObj(obj: any) {
    if (obj.$classDescription) {
        console.log(obj.$classDescription);
    } else {
        console.log(obj.constructor.name);
    }

    for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
            const prop = obj.$propDescriptions.find(
                (x: any) => x.propertyKey === item
            );

            console.log(`\t${prop.description}:${obj[item]}`);
        }
    }
}
