import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'fs';
import Database from 'better-sqlite3';

const rl = readline.createInterface({ input, output });

async function databaseHelper() {
    // const db = new sqlite3.Database('workouts_database.db', sqlite3.OPEN_READWRITE);

    fs.readFile('./workouts.txt', 'utf-8', async (err, data) => {
        const db = new Database('./workouts_database.db');
        db.pragma('journal_mode = WAL');

        let keepDatabaseHelperOpen = true;

        let totalLines = data.split('').filter((value) => value === '\n' ).length;
        let dataByLines = data.split('\n');

        while (keepDatabaseHelperOpen) {
            const reply = await rl.question('¿Qué operación desea realizar? \n 1. Añadir registro a la tabla de Sesiones\n 2. Añadir registro a la tabla Entrenamientos\n 3. Añadir registros a la tabla de SeriesRepeticiones\n 10. Salir\n');

            switch (reply) {
                case '1':
                    let newSessionData = ReadSessionData(dataByLines[0]);
                    PrintSessionData(newSessionData);
                    
                    let isDataCorrect = (await rl.question('¿Aprueba la información para ser insertada a la base de datos?')).toLowerCase();

                    if (isDataCorrect === 'y') {
                        let insertSQLquery = db.prepare('INSERT INTO Sesiones(dia, fecha, horaInicio, horaFin) VALUES(?, ?, ?, ?)');
                        const queryResult = insertSQLquery.run(newSessionData[0], newSessionData[1], newSessionData[2], newSessionData[3]);
                        console.log(queryResult);
                    } else console.log('La operación fue cancelada.');
                    
                    break;
                case '2':
                    for (let lineNo = 2; lineNo < totalLines; lineNo++) {
                        console.log('Line number ' + lineNo + ' --- ' + dataByLines[lineNo]);
                    }
                    break;
                case '3':
                    console.log('Option 3');
                    break;
                case '10':
                    keepDatabaseHelperOpen = false;
                    break;
                default:
                    console.log('Please type a valid option.');
                    break;
            }
        }

        rl.close();
        db.close();
    });
}

function ReadSessionData(textLine) {
    let sessionDataSplitted = textLine.split(' ');

    let sesionDia = sessionDataSplitted[0];
    let sesionFecha = `${sessionDataSplitted[4]}-${getMonthNumber(sessionDataSplitted[2])}-${sessionDataSplitted[3]}`;
    let sesionHoraInicio = `${sessionDataSplitted[6]}:00`;
    let sesionHoraFin = `${sessionDataSplitted[8]}:00`;

    return [sesionDia, sesionFecha, sesionHoraInicio, sesionHoraFin];
}

function PrintSessionData(sessionDataArray) {
    console.log(`Los valores a insertar en la tabla Sesiones son los siguientes:`);
    console.log(`   Dia de la sesion: ${sessionDataArray[0]}`);
    console.log(`   Fecha de la sesion: ${sessionDataArray[1]}`);
    console.log(`   Hora inicio de la sesion: ${sessionDataArray[2]}`);
    console.log(`   Hora fin de la sesion: ${sessionDataArray[3]}`);
}

function getMonthNumber(monthName) {
    switch (monthName) {
        case 'Ene':
            return '01';
            break;
        case 'Feb':
            return '02';
            break;
        case 'Mar':
            return '03';
            break;
        case 'Abr':
            return '04';
            break;
        case 'May':
            return '05';
            break;
        case 'Jun':
            return '06';
            break;
        case 'Jul':
            return '07';
            break;
        case 'Ago':
            return '08';
            break;
        case 'Sep':
            return '09';
            break;
        case 'Oct':
            return '10';
            break;
        case 'Nov':
            return '11';
            break;
        case 'Dic':
            return '12';
            break;
    }
}

databaseHelper();
