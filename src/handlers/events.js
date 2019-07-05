import { Event } from '../models/index'
import { regexGen } from '../utils/regexGen'
import { rearrange } from '../utils/rearrange'

export async function getEvents(req, res, next) {
    try {
        const { year, month, day, time, name } = req.query

        if (!year && !month && !day && !time && !name) {
            return next({
                status: 400,
                message: 'There should be at least one query input!'
            })
        }

        let hour = null
        let minute = null
        let nameRegex = null

        if (time) {
            //TIME FORMAT = HH:MM
            hour = time.split(':')[0]
            minute = time.split(':')[1]
        }

        if (name) {
            nameRegex = regexGen(name)
        } else {
            //IF NAME IS NOT PROVIDED, MATCH EVERYTHING
            nameRegex = /.*/
        }

        const events = await Event.aggregate([
            {
                $match: {
                    name: {
                        $regex: nameRegex,
                    },
                    $expr: {
                        $and: [
                            {
                                $eq: [
                                    {
                                        $year: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                    //IF YEAR IS NOT PROVIDED, RETURN ALL EVENTS
                                    year ? +year : {
                                        $year: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                ]
                            },
                            {
                                $eq: [
                                    {
                                        $month: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                    //IF MONTH IS NOT PROVIDED, RETURN ALL EVENTS
                                    month ? +month : {
                                        $month: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                ]
                            },
                            {
                                $eq: [
                                    {
                                        $dayOfMonth: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                    //IF DAY IS NOT PROVIDED, RETURN ALL EVENTS
                                    day ? +day : {
                                        $dayOfMonth: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                ]
                            },
                            {
                                $eq: [
                                    {
                                        $hour: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                    hour ? +hour : {
                                        $hour: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                ]
                            },
                            {
                                $eq: [
                                    {
                                        $minute: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                    minute ? +minute : {
                                        $minute: {
                                            date: '$schedule',
                                            timezone: 'Europe/Helsinki'
                                        },
                                    },
                                ]
                            }
                        ]
                    }
                }
            },
        ])

        //OPTIONAL - REARRANGE THE RESULTS BASED ON NAME SIMILARITY (USING LEVENSHTEIN ALGORITHM) - MIGHT BE USEFUL FOR NAME SUGGESTION
        const arranged = rearrange(events, name)

        console.log(arranged)
        return res.status(200).json({
            events: arranged
        })
    } catch (e) {
        console.log(e)
        return next(e)
    }
}

export async function getOngoing(req, res, next) {
    //FIND ONGOING EVENTS BY COMPARING (REQUEST TIME - SCHEDULED TIME) AND EVENT LENGTH 
    try {
        const events = await Event.aggregate([
            {
                $match: {
                    $expr: {
                        $gt: [
                            {
                                $multiply: [
                                    //IN MILISECS
                                    '$length', 3600000
                                ]
                            },
                            {
                                $abs: {
                                    $subtract: [
                                        new Date(), '$schedule'
                                    ]
                                }
                            }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    test: {
                        $subtract: [
                            new Date(), '$schedule'
                        ]
                    }
                }
            }
        ])

        console.log(`EVENTS`, events)
        return res.status(200).json({
            events
        })
    } catch (e) {
        console.log(e)
        return next(e)
    }
}

export async function addEvent(req, res, next) {
    try {
        const { name, length, schedule } = req.body
        if (!name || !schedule || !length) {
            next({
                status: 400,
                message: 'Missing input field(s)'
            })
        } else {
            const event = await Event.create({
                name,
                length,
                schedule
            })

            console.log(event)
            return res.status(200).json({ event })
        }
    } catch (e) {
        console.log(e)
        return next(e)
    }
}