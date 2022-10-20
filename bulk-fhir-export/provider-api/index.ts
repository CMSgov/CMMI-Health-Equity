import express from 'express';
import mongoose from 'mongoose';
import ExportConfigService, { ExportConfig } from './export-config-service';
import BulkExporter from './export-engine/bulk-exporter';
const fs = require('fs');

const app = express();
const port = process.env.PORT ?? 8080;

const mongoUri = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB_NAME;

if(mongoDbName == null || mongoUri == null) throw new Error("MONGO_URI and MONGO_DB_NAME are required process variables");


const exportConfigService = new ExportConfigService();
const bulkExporter = new BulkExporter();

app.use(express.json());
app.get('/config', async (_req,res,next) => {
    try {
        const configs = await exportConfigService.getAll();
        res.json(configs);
    } catch(e) {
        next(e);
    }
})
app.get('/config/:id', async (req,res,next) => {
    try {
        const config = await exportConfigService.get(req.params.id);
        res.json(config);
    } catch(e) {
        next(e);
    }
})
app.post('/config/validate', async (req,res,next) => {
    try {
        const result = await exportConfigService.validateConfig(req.body);
        res.json(result);
    } catch(e) {
        next(e);
    }
})
app.get('/config/:id/validate', async (req,res,next) => {
    try {
        const config = await exportConfigService.validate(req.params.id);
        res.json(config);
    } catch(e) {
        next(e);
    }
})
app.post('/config', async (req,res,next) => {
    console.log('posting config');
    try {
        const config = req.body as ExportConfig;
        const result = await exportConfigService.create(config);
        res.json(result);
    } catch(e) {
        next(e);
    }
})
app.put('/config/:id', async (req,res,next) => {
    const config = req.body as ExportConfig;
    config._id = req.params.id;
    res.json(config);
})

app.post('/config/:id/export', async (req, res, next) => {
    const config = await exportConfigService.get(req.params.id);
    const result = await bulkExporter.doBulkExport(config);
    res.json(result);
})

app.get('/config/:configId/export/:exportId/file', async (req, res, next) => {
    const filePath = await exportConfigService.getExportFile(req.params.configId, req.params.exportId);
    res.download(filePath);
});

async function init() {
    await mongoose.connect(mongoUri, {
       dbName: mongoDbName 
    });
    app.listen(port, () => {
        console.log('provider-api is live now');
    });
}

init();
