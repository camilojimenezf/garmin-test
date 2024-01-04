import { pausableWatch, useBluetooth } from "@vueuse/core";

export const useGarmin1 = () => {
  const { isSupported, isConnected, device, requestDevice, server } =
    useBluetooth({
      acceptAllDevices: true,
    });
  const isRequesting = ref(false);

  console.log("isSupported", isSupported.value);
  console.log("isConnected", isConnected.value);
  console.log("device", device.value);
  console.log("server", server.value);

  const handleRequestDevice = async () => {
    console.log("handleRequestDevice");
    alert("handleRequestDevice");
    isRequesting.value = true;
    try {
      await requestDevice();
    } catch (err) {
      alert(err.message);
      console.log("err", err);
    }
    // isRequesting.value = false;
  };

  const { stop } = pausableWatch(isConnected, (newIsConnected) => {
    console.log("newIsConnected", newIsConnected);
    if (!newIsConnected || !server.value) return;
    // Attempt to get the battery levels of the device:
    // We only want to run this on the initial connection, as we will use an event listener to handle updates:
    console.log("isSupported", isSupported.value);
    console.log("isConnected", isConnected.value);
    console.log("device", device.value);
    console.log("server", server.value);
    stop();
  });

  return {
    isSupported,
    isConnected,
    device,
    server,
    isRequesting,
    handleRequestDevice,
  };
};
