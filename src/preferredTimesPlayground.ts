import controller from './controllers/User';

let userId: string = '62cb358c8f937bf9aa595a3a';
let time1 = new Date();
let preferredTimes: [Date, Date, Date] = [time1, time1, time1];

controller.updateUserPreferredTimes(userId, preferredTimes);
