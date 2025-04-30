
/**
 * Use it when accessing a property from an array is needed (because we'll certantly forget to add a property in Tiled at some point)
 * @param {Array} obj 
 * @param {string} propName 
 */
export function assertHasProperty(obj, propName) {
    if (!obj.properties || !Array.isArray(obj.properties)) {
      console.error("Object with missing properties:", obj);
      throw new Error(`Object is missing 'properties' array.`);
    }
  
    if (!obj.properties.some(p => p.name === propName)) {
      console.error("Object missing expected property:", obj);
      throw new Error(`Missing '${propName}' property.`);
    }
  }