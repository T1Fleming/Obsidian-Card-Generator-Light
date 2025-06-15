import { DOCUMENT_ROOT, processOutputMd } from "./processMd.js";

processOutputMd().then(() => {
    console.log('processOutputMd finished');
}).catch((error) => {
    console.error('Error in processOutputMd:', error);
});