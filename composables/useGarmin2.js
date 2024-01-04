import { onMounted, onUnmounted } from "vue";

// const options = {
//   filters: [{ namePrefix: "Garmin" }],
// };

const options = {
  acceptAllDevices: true,
};

export const useGarmin2 = () => {
  const isRequesting = ref(false);
  const isConnected = ref(false);

  const hasBluetoothAvailability = ref(false);
  const hasErrorBluetoothAvailability = ref(true);
  const hasErrorBluetoothAvailabilityMessage = ref("");

  const checkBluetoothAvailability = async () => {
    try {
      const availability = await navigator.bluetooth.getAvailability();
      hasBluetoothAvailability.value = availability;
      hasErrorBluetoothAvailability.value = !availability;
      return availability;
    } catch (err) {
      hasErrorBluetoothAvailabilityMessage.value = err.message;
      hasErrorBluetoothAvailability.value = true;
      // TODO: Remove this alert when you are done debugging:
      alert(err.message);
      console.log("err", err);
    }
  };

  const getAvailableDevices = async () => {
    console.log("requestDevice");
    alert("requestDevice");
    isRequesting.value = true;
    try {
      const response = await navigator.bluetooth.requestDevice(options);
      console.log("response", response);
      // TODO: validate device Gatt connection and handle unsupported device.
      isConnected.value = true;
      return response;
    } catch (err) {
      alert(err.message);
      console.log("err", err);
    }
    isRequesting.value = false;
  };

  const connectDevice = async (device) => {
    console.log("connectDevice");
    alert("Connecting Device...");
    isRequesting.value = true;
    try {
      const server = await device.gatt.connect();
      console.log("server", server);
      isConnected.value = true;
      return server;
    } catch (err) {
      alert(err.message);
      console.log("err", err);
    }
    isRequesting.value = false;
  };

  const getDevices = async () => {
    console.log("getDevices");

    isRequesting.value = true;
    try {
      const devices = await navigator.bluetooth.getDevices();
      console.log("devices", devices);
      devices.forEach(async (device) => {
        if (device.name.includes("Garmin")) {
          // TODO: validate device Gatt connection and handle unsupported device.
          if (device.gatt.connected) {
            isConnected.value = true;
            return;
          }
          await connectDevice(device);
        }
      });
      return devices;
    } catch (err) {
      alert(err.message);
      console.log("err", err);
    }
    isRequesting.value = false;
  };

  onMounted(async () => {
    console.log("onMounted");
    const isAvailable = await checkBluetoothAvailability();
    // TODO: handle case when is not available.
    if (!isAvailable) return;
    getDevices();
  });

  return {
    isConnected,
    isRequesting,
    hasBluetoothAvailability,
    getAvailableDevices,
    getDevices,
  };
};
