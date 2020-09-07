const Compute = require("@google-cloud/compute");
const { vault_v1 } = require("googleapis");
const compute = new Compute({
  projectId: "trainmlproject-281219",
  keyFilename: "/Users/esin/Downloads/trainmlproject-281219-426dbe893c23.json",
});

async function createInstance(
  project_id,
  region,
  zone,
  name,
  machine_type,
  image_name,
  disk_name,
  disk_storage,
  firewall_name,
  network_name,
  port
) {
  const config_vm = {
    machineType: `zones/${zone}/machineTypes/${machine_type}`,
    name: name,
    metadata: {
      kind: "compute#metadata",
      items: [
        {
          key: "department",
          value: "development",
        },
        {
          key: "environment",
          value: process.env.STAGE,
        },
        {
          key: "CLIENT_ID",
          value: "105d87c9-65fe-453b-ae15-b8b6663b207e",
        },
        {
          key: "STAGE",
          value: "dev",
        },
        {
          key: "MEMORY_PER_DEVICE",
          value: "14695739392",
        },
        {
          key: "DEVICE_TO_CPU",
          value: JSON.stringify({
            "0": "0,1",
            "1": "2,3",
          }),
        },
        {
          key: "SHM_SIZE",
          value: "6371147776",
        },
        {
          key: "CERTIFICATE_KEY",
          value:
            "-----BEGIN CERTIFICATE-----\nMIIDWTCCAkGgAwIBAgIULKmNKU68XVf4TYd6bUdU4QsR1QcwDQYJKoZIhvcNAQEL\nBQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g\nSW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTIwMDgxNjE5MjU1\nNFoXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0\nZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM1XejM3qfnQjoMAn5FJ\n8DvYkb1RPx5lg+QKok67A2U9t/lT9tzvrNgfaVcRqxMDzUhA4ZmHSOhLb3hFvBHC\n985zcvHV7jNyeKT1mJpl2kTcgigNSXip5mGmlcuWkWKFdO8ES/2WFnaHDrBGfTJM\nJ766viPbSdY+YBLpJkGd4m3Be/Wi/Ru3QTnJgUGiQxyolSszCH2wCq9Afwnu2ijE\nMpr3cT4mDzBvSfUDs3/3J31QBAdDMJd6DoQW4SNgjP7nAXdCWTf+Vv9RoSZV88EC\nV0lu5aznqbMilEvDTrwmcfNgCbsU+afzRKNVCyf8UqNr1DEtDfVrVXnr2ADxIvXC\nNekCAwEAAaNgMF4wHwYDVR0jBBgwFoAULqTA0DFCMGl4oCnTotTZANtyRg0wHQYD\nVR0OBBYEFIbbkePbb/1jVhsbyc/BqxFN4JK1MAwGA1UdEwEB/wQCMAAwDgYDVR0P\nAQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQBKPBv5xWBqYfhgTcy/LCqG4CGn\nn0iibOHlwiFCo6I/eeujxyxoGYU3TxfV8zDYuqJAyQdRtU2DwvKvfb1492FFHP4Q\njvEUW919pup10CdWHfhtYBeyaAiOOjYGwXyY8+qx+g7nSTEXGHtVojxCf7Fl1ITh\n6R6wFSCCERzYQ9e4NKzisvX0iq5AeJpull3TmVMoNBUPUUliLbgJ/ShjjdRvsx6n\nwCgRBhkiJe7u77Oe81YryARWoqr7+p6exBeJN7P+vGQy5vJk3AP6lIDZDjSLTrMd\nK5hqCqQ6S7alGa40DM11E6YThpMPXIXrYFd/JRusP07wKr2pjxE21YCxvB3j\n-----END CERTIFICATE-----",
        },
        {
          key: "PRIVATE_KEY",
          value:
            "-----BEGIN RSA PRIVATE KEY-----\nMIIEpgIBAAKCAQEAzVd6Mzep+dCOgwCfkUnwO9iRvVE/HmWD5AqiTrsDZT23+VP2\n3O+s2B9pVxGrEwPNSEDhmYdI6EtveEW8EcL3znNy8dXuM3J4pPWYmmXaRNyCKA1J\neKnmYaaVy5aRYoV07wRL/ZYWdocOsEZ9Mkwnvrq+I9tJ1j5gEukmQZ3ibcF79aL9\nG7dBOcmBQaJDHKiVKzMIfbAKr0B/Ce7aKMQymvdxPiYPMG9J9QOzf/cnfVAEB0Mw\nl3oOhBbhI2CM/ucBd0JZN/5W/1GhJlXzwQJXSW7lrOepsyKUS8NOvCZx82AJuxT5\np/NEo1ULJ/xSo2vUMS0N9WtVeevYAPEi9cI16QIDAQABAoIBAQDKZ+f0hHHv5TwU\ntZCUTiWXWCqQSn3FIJuZNUI4CO+X4/Zste8oaLgfcRcM1EWlQKIhDpNSGqArGfCO\nxW5Us7JAtlwfNZjO7Y8uS0hZKPy11AYYJMC/R/nnV6VgQNKeIp7Y24tsM32A6C/6\nYgEWiyrCPqEeBxIJNQLOoTMsisyfEc1FZ6/qBaDkk5fO6wcoUtInhyvYAdMeYy/0\nv67BkMdIgCS/4sDM3xzNKIEinocjT5LBpVDC+My0ac8lDJNc1xJKVuoKhZUSRG/Q\nt82cND1otKCWJk0kh1SiWekpOaDTjeeXgjSS1ViHUATPq2GiPHYnueyQGtqA5ih3\n8bu1GTVhAoGBAOwCcpFkK69L9V8HrAdGbFQUK06mFWHVf3S2fDZhB+2zz9vExEkX\nCUubeCZgUV76BVRsPAc1E5k4PC6GFbFSKdlNUt0YDzi1/TS41NgTmDEJpfLZGB30\n5ONtkewnK83+Pl5gd5pnogOE9TVVzW5O+Bl+N61KTcw5EFMGsvi3tsKrAoGBAN68\nCdFBFOUbv4qM4pXsQs6R9+SUsFT21Q0l1DUBd9HI+dDikuDz9TA7qPpsJdLncing\n3nIcA4v5j0tc68eiC5/ubLGJyojvainU219g8LCMf2SZAaepfVhxNFnqJ0UVD65w\ne4duLwijNPTsNdyCPQpaAAthQAzWNOp3NNyTPgm7AoGBAMSF1TjUHLw/l/alwM3e\nCl6I3PcEvVFWImfhfNUbPyrkS/VIh9oE4KygrQ/nrFpV/xIpfmLSA5vWg+aJqI6b\nSFW2WYXZfvNON6YrMrEqv9Q1oIXz2G05e08V8iifBY7mYrDbyzw7h2E+2aCr7gAo\nqdcwjtQxx06DReCc93K8J+c5AoGBALcKzP6cf3FxBk30TdlrWdOs/Y1p7CdG2ft+\nFRCibjeG9FYHfTFFC0BiJxH1gnf6IEXuOKCKCRglNO94I4Ph1a/PHqAgXsN+DT7n\nYIjXf7V3INIpM8T3cr0V+zHRTghlsIdohPvdPuXYShLlc7YNieBR6itv9lUWTFJL\nOLP0hU01AoGBAIyNctxvuFA2hns3I56dyHRKnhupCQmdxLsPM+3v9Utz8EOB1E8+\n0Mu4IhWR/Smkaj92kIRO7hIKUKRiBAMiv/NPl0wk7igHOUC6EhgTeC1tijs5ul+y\n6AxtWsahetqdO4V/ZOfhmZi8CnG73XUbEulP7VPhc7Rd3PDvkiaBfHfy\n-----END RSA PRIVATE KEY-----",
        },
        {
          key: "INFLUX_USER",
          value: "a1",
        },
        {
          key: "INFLUX_HOSTNAME",
          value: "gcp_test",
        },
        {
          key: "INFLUX_USERNAME",
          value: "gcp_test",
        },
        {
          key: "INFLUX_PASSWORD",
          value: "",
        },
      ],
    },
    tags: {
      items: [name],
    },
    disks: [
      {
        type: "PERSISTENT",
        initializeParams: {
          sourceImage: `projects/${project_id}/global/images/${image_name}`, //image-of-my-trainml-vm
        },
        boot: true,
        diskSizeGb: "10",
      },
      {
        type: "PERSISTENT",
        deviceName: `${disk_name}`,
        source: `projects/${project_id}/zones/${zone}/disks/${disk_name}`,
        boot: false,
        diskSizeGb: disk_storage,
        kind: "compute#attachedDisk",
        diskType: "pd-ssd",
      },
    ],
    shieldedInstanceConfig: {
      enableSecureBoot: false,
    },
    networkInterfaces: [
      {
        kind: "compute#networkInterface",
        subnetwork: `projects/${project_id}/regions/${region}/subnetworks/${network_name}`,
        accessConfigs: [
          {
            kind: "compute#accessConfig",
            name: "External NAT",
            type: "ONE_TO_ONE_NAT",
            networkTier: "PREMIUM",
          },
        ],
        aliasIpRanges: [],
      },
    ],
    //guestAccelerators: [
    //  {
    //    acceleratorCount: `${gpu_count}`,
    //    acceleratorType: `https://compute.googleapis.com/compute/v1/projects/${project_id}/zones/${zone}/acceleratorTypes/${gpu_type}`,
    //  },
    //],
    //scheduling: {
    //  onHostMaintenance: "TERMINATE",
    //  automaticRestart: true,
    //},
  };
  const config_firewall = {
    kind: "compute#firewall",
    selfLink: `projects/${project_id}/global/firewalls/${firewall_name}`,
    network: `projects/${project_id}/global/networks/${network_name}`,
    direction: "INGRESS",
    priority: 1000,
    targetTags: [name],
    allowed: [
      {
        IPProtocol: "tcp",
        ports: [port],
      },
      {
        IPProtocol: "udp",
        ports: [port],
      },
    ],
    sourceRanges: ["0.0.0.0/0"],
  };

  const firewall = compute.firewall(firewall_name);
  const vm_zone = compute.zone(zone);

  const [fw, fw_operation, fw_response] = await firewall.create(
    config_firewall
  );
  const [vm, vm_operation, vm_response] = await vm_zone.createVM(
    name,
    config_vm
  );
  console.log(fw);
  console.log(vm);
  console.log(fw_response);
  console.log(vm_response);
  await Promise.all([fw_operation.promise(), vm_operation.promise()]);
}

createInstance(
  "trainmlproject-281219", // proj id
  "us-central1", // region
  "us-central1-a", // zone
  "vm-test-worker-2", // vm name
  "n1-standard-1", // machine_type
  "data-image3", // image for disk1
  "vm-test-data-1-1", // disk for disk2
  15, // 2nd disk size
  "firewall-test-worker-2", // firewall name
  "vpc-1", // net name
  22 // port
).then();
