import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import FilterTable from '../components/FilterTable';
import { DataRow} from '../components/FilterTable'

async function getData(): Promise<DataRow[]> {
  const results: DataRow[] = [];
  const filePath = path.join(process.cwd(), 'data', 'csv-registration.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: any) => {
        if (data.ID && data.Nombre && data.Email && data['Fecha de Registro']) {
          results.push({
            ID: data.ID,
            Nombre: data.Nombre,
            Email: data.Email,
            FechaDeRegistro: data['Fecha de Registro'] 
          });
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}
export default async function Dashboard() {
    try {
      const data = await getData();
      return (
        <div>
          <h1>Datos del CSV</h1>
          <FilterTable data={data} />
        </div>
      );
    } catch (error) {
      return <div>Error loading data</div>;
    }
  }
