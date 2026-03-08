import { Router } from 'express';
import { db } from '../db/index.js';
import { matches } from '../db/schema.js';
import { getMatchStatus } from '../utils-match/match-status.js';
import { createMatchSchema, listMatchesQuerySchema } from '../validation/matches.js';


const matchRouter = Router();

matchRouter.get('/', async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query)
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid data' })
    }
    const { limit } = parsed.data
    try {

        const matches = await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(limit)
        res.status(200).json({ data: matches })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message, details: JSON.stringfy(e) })
    }

})

matchRouter.post('/', async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body)

    const { data: { startTime, endTime, homeScore, awayScore } } = parsed;

    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid data' })
    }
    try {
        const [event] = await db.insert(matches).values({
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            homeScore: homeScore ?? 0,
            awayScore: awayScore ?? 0,
            status: getMatchStatus(startTime, endTime),
        }).returning()
        res.status(201).json({ data: event })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message, details: JSON.stringfy(e) })
    }


})