export function sendToNUI(event: string, data: any) {
    if (window.postMessage) {
      window.postMessage({ type: event, data: data }, '*');
    } else {
      console.error('postMessage is not supported in this environment.');
    }
  }
  

  export function onNUIEvent(event: string, callback: (data: any) => void) {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === event) {
        callback(event.data.data);
      }
    });
  }
  
  export interface Vehicle {
    vehicle: string;
    plate: string;
    model: number;
    location: string;
    statistics: {
      engine: number;
      body: number;
      fuel: number;
    };
    isFavorite: boolean;
    isOut: boolean;
  }
  
  export function sendVehicleData(vehicle: Vehicle) {
    sendToNUI('vehicleData', vehicle);
  }
  
  export function spawnVehicle(plate: string) {
    sendToNUI('spawnVehicle', { plate });
  }


  export function findVehicle(plate: string) {
    sendToNUI('findVehicle', { plate });
  }
  