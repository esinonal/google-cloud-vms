const Compute = require("@google-cloud/compute");
const { vault_v1 } = require("googleapis");
const compute = new Compute({
  projectId: "trainmlproject-x",
  keyFilename: "/Users/esin/Downloads/x.json",
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
          value: "",
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
            "",
        },
        {
          key: "PRIVATE_KEY",
          value:
            "",
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
          sourceImage: `projects/${project_id}/global/images/${image_name}`,
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
    //guestAccelerators: [  #In case want to attach GPUs to the instance.
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
  "project-x", // proj id
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
