const Compute = require("@google-cloud/compute");
const { vault_v1 } = require("googleapis");
const compute = new Compute({
  projectId: "trainmlproject-281219",
  keyFilename: "/Users/esin/Downloads/trainmlproject-281219-426dbe893c23.json",
});

async function stopInstance(zone, vm_name) {
  const vm_zone = compute.zone(zone);
  const vm = vm_zone.vm(vm_name);

  const [stop_vm, stop_vm_operation, stop_vm_response] = await vm.stop();
}

stopInstance("us-central1-a", "xvm5").then();
