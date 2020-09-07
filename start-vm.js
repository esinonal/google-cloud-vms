const Compute = require("@google-cloud/compute");
const { vault_v1 } = require("googleapis");
const compute = new Compute({
  projectId: "trainmlproject-281219",
  keyFilename: "/Users/esin/Downloads/trainmlproject-281219-426dbe893c23.json",
});

async function startInstance(zone, vm_name) {
  const vm_zone = compute.zone(zone);
  const vm = vm_zone.vm(vm_name);

  const [start_vm, start_vm_operation, start_vm_response] = await vm.start();
}

startInstance("us-central1-2a", "xvm5").then();
