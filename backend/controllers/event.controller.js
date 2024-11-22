const EventLogging = require('../models/event.model');
const createHash = require('../utils/hash');

//create logs
exports.createLogging = async (req, res) => {
    const { event_type, source_app_id, data_payload, timestamp } = req.body;
    const eventTimestamp = timestamp || new Date();

    try {
        const lastEvent = await EventLogging.findOne().sort({ timestamp: -1 }).limit(1);

        const previousHash = lastEvent ? lastEvent.hash : null;

        const newEvent = new EventLogging({
            event_type,
            timestamp: eventTimestamp,
            source_app_id,
            data_payload,
            previous_hash: previousHash,
            hash: createHash({
                event_type,
                source_app_id,
                data_payload,
                timestamp: eventTimestamp,
                previous_hash: previousHash,
            })
        });

        await newEvent.save();

        res.status(201).json({
            success: true,
            id: newEvent._id,
            message: "Event logged successfully....",
            log: newEvent,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

//get logs
exports.getCreateLog = async (req, res) => {
    const { event_type, start_date, end_date, source_app_id, page = 1, limit = 10 } = req.query;

    let query = {};
    if (event_type) {
        query.event_type = event_type;
    }
    if (source_app_id) {
        query.source_app_id = source_app_id;
    }
    if (start_date && end_date) {
        query.timestamp = { $gte: new Date(start_date), $lte: new Date(end_date) };
    }

    try {
        const events = await EventLogging.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ timestamp: -1 });

        const totalEvents = await EventLogging.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Events retrieved successfully....",
            events,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                totalItems: totalEvents,
            },
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

//stream logs
exports.streamLogs = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const interval = setInterval(async () => {
        const latestEvent = await EventLogging.findOne().sort({ timestamp: -1 }).limit(1);
        if (latestEvent) {
            res.write(`data: ${JSON.stringify(latestEvent)}\n\n`);
        }
    }, 1000);

    req.on('close', () => {
        clearInterval(interval);
    });
};
