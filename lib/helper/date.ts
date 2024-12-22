import { intervalToDuration } from "date-fns";


export const DateToDurationString = (end: Date | null | undefined, start: Date | null | undefined) => {
    if (!start || !end) return;

    const timeElapsed = end.getTime() - start.getTime();

    if (timeElapsed < 1) return `${timeElapsed} ms`;

    const duration = intervalToDuration({
        start: 0,
        end: timeElapsed
    });


    return `${duration.minutes || 0}m ${duration.seconds || 0}s`;


}