import { z } from 'zod';

/**
 * Match Status Constants
 */
export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
};

const isoDateString = z.iso.datetime();

/**
 * Validates query parameters for listing matches.
 * - limit: Optional coerced positive integer, max 100.
 */
export const listMatchesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
});

/**
 * Validates route parameters containing a match ID.
 * - id: Required coerced positive integer.
 */
export const matchIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

/**
 * Validates the creation of a new match.
 * Includes chronological validation for start and end times.
 */
export const createMatchSchema = z.object({
    sport: z.string().trim().min(1, 'Sport is required'),
    homeTeam: z.string().trim().min(1, 'Home team is required'),
    awayTeam: z.string().trim().min(1, 'Away team is required'),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid ISO date string for startTime',
    }),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid ISO date string for endTime',
    }).optional(),
    homeScore: z.coerce.number().int().nonnegative().optional().default(0),
    awayScore: z.coerce.number().int().nonnegative().optional().default(0),
}).superRefine((data, ctx) => {
    if (data.endTime && data.startTime) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);

        if (end <= start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'endTime must be chronologically after startTime',
                path: ['endTime'],
            });
        }
    }
});

/**
 * Validates score updates.
 */
export const updateScoreSchema = z.object({
    homeScore: z.coerce.number().int().nonnegative(),
    awayScore: z.coerce.number().int().nonnegative(),
});
