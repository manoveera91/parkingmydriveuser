// import moment from "moment";


// const formatDateTime = (values) => {
//     const fromMoment = moment(values)
//     return fromMoment.format('YYYY-MM-DD HH:mm:ss')
// }

// export {
//     formatDateTime
// }

import moment from "moment";

const formatDateTime = (date, time) => {
    // Parse the date using moment
    const parsedDate = moment(date);

    // Extract hours, minutes, and AM/PM from the time string
    const [hours, minutes] = time.split(":").map(part => parseInt(part)); // Split time into hours and minutes
    const isPM = time.includes("PM"); // Check if it's PM

    // Adjust hours for PM (if it's not 12 PM)
    if (isPM && hours !== 12) {
        parsedDate.add(12, "hours");
    } else if (!isPM && hours === 12) { // Adjust hours for 12 AM
        parsedDate.hours(0);
    } else { // For other hours
        parsedDate.hours(hours);
    }

    // Set the minutes part
    parsedDate.minutes(minutes);

    // Return the formatted date and time
    return parsedDate.format("YYYY-MM-DD HH:mm:ss");
}
const combineDateTime = (dateString, timeString) => {
    // Parse the date
    const date = new Date(dateString);

    // Parse the time
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Adjust hours for PM time
    if (period === "PM" && hours !== 12) {
        hours += 12;
    } else if (period === "AM" && hours === 12) {
        hours = 0; // 12 AM is 0 hours
    }

    // Set the time components to the date object
    date.setHours(hours, minutes);

    // Format the combined date and time as "YYYY-MM-DD HH:mm:ss"
    const formattedDateTime = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;

    return formattedDateTime;
};

const formattedDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);

    return `${day}-${month}-${year}`;
};

const formatDateYear = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // Months are zero-based, so we add 1
    month = month < 10 ? `0${month}` : month; // Ensure month is two digits
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day; // Ensure day is two digits
    return `${year}-${month}-${day}`;
};

function calculateTotalHours(startTime, endTime) {
    // Parse start time
    let [startHour, startMinute, startPeriod] = startTime.split(/:| /);
    startHour = parseInt(startHour);
    startMinute = parseInt(startMinute);

    // Parse end time
    let [endHour, endMinute, endPeriod] = endTime.split(/:| /);
    endHour = parseInt(endHour);
    endMinute = parseInt(endMinute);

    // Convert start and end periods to 24-hour format
    if (startPeriod === "PM" && startHour !== 12) {
        startHour += 12;
    }
    if (endPeriod === "PM" && endHour !== 12) {
        endHour += 12;
    } else if (endPeriod === "AM" && endHour === 12) {
        endHour = 0; // Midnight is 0 hours
    }

    // Calculate the total hours
    let totalHours = endHour - startHour;

    if (endMinute < startMinute) {
        totalHours--; // Subtract 1 hour if end minutes are less than start minutes
        endMinute += 60; // Adjust minutes by adding 60
    }

    totalHours += (endMinute - startMinute) / 60; // Add fractional hours for minutes difference

    // If the total hours is negative, add 24 hours to account for cases where end time is on the next day
    if (totalHours < 0) {
        totalHours += 24;
    }

    return totalHours;
}

// function calculateTotalHours(startTime, endTime) {
//     // Parse start time
//     let [startHour, startMinute, startPeriod] = startTime.split(/:| /);
//     startHour = parseInt(startHour);
//     startMinute = parseInt(startMinute);

//     // Parse end time
//     let [endHour, endMinute, endPeriod] = endTime.split(/:| /);
//     endHour = parseInt(endHour);
//     endMinute = parseInt(endMinute);

//     // Convert start and end periods to 24-hour format
//     if (startPeriod === "PM" && startHour !== 12) {
//         startHour += 12;
//     }
//     if (endPeriod === "PM" && endHour !== 12) {
//         endHour += 12;
//     } else if (endPeriod === "AM" && endHour === 12) {
//         endHour = 0; // Midnight is 0 hours
//     }

//     // Calculate the total hours
//     let totalHours = endHour - startHour;
//     if (totalHours < 0) {
//         totalHours += 24; // Add 24 hours for cases where end time is on the next day
//     }

//     // Adjust minutes
//     if (endMinute < startMinute) {
//         totalHours--; // Subtract 1 hour if end minutes are less than start minutes
//     } else if (endMinute > startMinute) {
//         totalHours += (endMinute - startMinute) / 60; // Add fractional hours for minutes difference
//     }

//     return totalHours;
// }

const calculateTotalDuration = (fromDate, fromTime, toDate, toTime) => {
    console.log("Input Values:", fromDate, fromTime, toDate, toTime);

    // Parse fromDate
    const fromDateArr = fromDate.split('-');
    const fromYear = parseInt(fromDateArr[0], 10);
    const fromMonth = parseInt(fromDateArr[1], 10) - 1; // Months are zero-indexed
    const fromDay = parseInt(fromDateArr[2], 10);

    // Parse fromTime
    let fromHours = parseInt(fromTime.substring(0, 2), 10);
    const fromMinutes = parseInt(fromTime.substring(3, 5), 10);
    const fromAmPm = fromTime.substring(5).toUpperCase();

    // Adjust hours for AM/PM
    if (fromAmPm === 'PM' && fromHours !== 12) {
        fromHours += 12; // Add 12 hours for PM times (except for 12:00PM)
    } else if (fromAmPm === 'AM' && fromHours === 12) {
        fromHours = 0; // 12:00AM is equivalent to 0:00
    }

    // Parse toDate
    const toDateArr = toDate.split('-');
    const toYear = parseInt(toDateArr[0], 10);
    const toMonth = parseInt(toDateArr[1], 10) - 1; // Months are zero-indexed
    const toDay = parseInt(toDateArr[2], 10);

    // Parse toTime
    let toHours = parseInt(toTime.substring(0, 2), 10);
    const toMinutes = parseInt(toTime.substring(3, 5), 10);
    const toAmPm = toTime.substring(5).toUpperCase();

    // Adjust hours for AM/PM
    if (toAmPm === 'PM' && toHours !== 12) {
        toHours += 12; // Add 12 hours for PM times (except for 12:00PM)
    } else if (toAmPm === 'AM' && toHours === 12) {
        toHours = 0; // 12:00AM is equivalent to 0:00
    }

    // Create Date objects for from and to
    const fromDateObj = new Date(fromYear, fromMonth, fromDay, fromHours, fromMinutes);
    const toDateObj = new Date(toYear, toMonth, toDay, toHours, toMinutes);

    // Calculate the difference in milliseconds
    let differenceInMs = Math.abs(toDateObj - fromDateObj);

    // Convert milliseconds to hours
    const totalHours = differenceInMs / (1000 * 60 * 60);

    return totalHours;
};

function convertToMySQLDatetime(dateString, timeString) {
    // Parse the date and time strings
    const date = new Date(dateString);
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Adjust the date object to the specified time
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(0); // Optional, depending on your requirements

    // Format the date object into a MySQL-compatible datetime string
    const formattedDatetime = date.toISOString().slice(0, 19).replace('T', ' ');

    return formattedDatetime;
}


// const convertToMySQLDatetime = (dateString, timeString) => {
//     // Split the date and time string
//     const [datePart, timePart] = dateString.split(' ');
//     // Split the date into its components
//     const [day, month, year] = datePart.split('-').map(part => parseInt(part));

//     // Extract hours and minutes from the time string
//     const [hours, minutes] = timeString.split(':').map(part => parseInt(part));

//     // Convert 12-hour time format to 24-hour time format
//     let hour24 = hours;
//     if (timeString.includes('AM') && hours === 12) {
//         hour24 = 0;
//     } else if (timeString.includes('PM') && hours !== 12) {
//         hour24 += 12;
//     }

//     // Format the date and time according to MySQL format
//     const formattedDate = `20${year}-${month}-${day}`;
//     const formattedTime = `${hour24}:${minutes}:00`;

//     return `${formattedDate} ${formattedTime}`;
// };

const convertToMySQLDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function separateDateAndTime(datetimeString) {
    const date = new Date(datetimeString);

    // Separate date and time
    const dateString = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    const timeString = date.toISOString().split('T')[1].split('.')[0].slice(0, -3);

    return { date: dateString, time: timeString };
}

export {
    calculateTotalDuration,
    calculateTotalHours,
    formatDate,
    formatDateTime,
    combineDateTime,
    formattedDateTime, separateDateAndTime,
    formatDateYear, convertToMySQLDatetime, convertToMySQLDate
}
