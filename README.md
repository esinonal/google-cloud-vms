# google-cloud-vms

These are a set of node scripts to manipulate google cloud virtual machines. 

The simplest ones are to start, stop, or destroy an existing VM. Start-vm simply starts an existing vm that is currently stopped, and stop vm stops a running vm. There are two options to create an entirely new VM, create-data-vm and create-worker-vm. The main difference between them is that Create-data-vm creates a vm with two disks, both of which are made from images, while create-worker-vm has the first disk made from an image, while the second one is made from an attached disk. 

The intended use of these scripts is that the data-vm populates the second disk with zfs data, and then passes on this second disk to the worker-vm, which can then access this data in its operations. The process is: 
-Create-data-vm is run in order to create the data vm.
-The startup_script.sh is run inside this data vm so that the second disk of this vm is filled with data. Zfs has already been installed into this image, but sudo zpool import -a, and sudo zpool export -a have to be used to access these datasets. Ipfs is used in order to used in order to enable this.
-Then, the datavm has served its purpose and the disk is filled with the data we need so the worker vm is started. (create-worker-vm). The second disk of the worker-vm is the disk that comes from the data-vm.
-Then, the worker vm has the necessariy data in order to run the application.

The credentials are set in order to access the account, which is done with a json credentials file. The create-vm scripts use REST APIs.
