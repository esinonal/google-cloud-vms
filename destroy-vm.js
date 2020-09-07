const Compute = require("@google-cloud/compute");
const { vault_v1 } = require("googleapis");
const compute = new Compute({
  projectId: "trainmlproject-281219",
  keyFilename: "/Users/esin/Downloads/trainmlproject-281219-426dbe893c23.json",
});

async function deleteInstance(zone, vm_name, firewall_name) {
  const vm_zone = compute.zone(zone);
  const vm = vm_zone.vm(vm_name);

  const [
    delete_vm,
    delete_vm_operation,
    delete_vm_response,
  ] = await vm.delete();

  const firewall = compute.firewall(firewall_name);
  const [
    delete_firewall,
    delete_firewall_operation,
    delete_firewall_response,
  ] = await firewall.delete();
}

deleteInstance("us-central1-a", "vm-name-3", "firewall-name-3").then();
