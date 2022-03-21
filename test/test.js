const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Calendar", function () {
  let deployedContract, contract;
  let owner, address1, address2;

  beforeEach(async () => {
    [owner, address1, address2] = await ethers.getSigners();

    console.log(`owner->${owner.address}`);
    console.log(`address1->${address1.address}`);
    console.log(`address2->${address2.address}`);

    contract = await ethers.getContractFactory("Calendar");
    deployedContract = await contract.deploy();
    await deployedContract.deployed();
  });

  it("Should set/get the rate", async function () {
    const tx = await deployedContract.setRate(100);
    await tx.wait();
    expect(await deployedContract.getRate()).to.equal(100);

  });

  it("Should fail if no owner the rate", async function () {

    await expect(deployedContract.connect(address1).setRate(500))
      .to.be.revertedWith("Only the owner who can set (adjust) the rate");

  });

  it("Should add two appointments", async () => {

    const tx0 = await deployedContract.setRate(ethers.utils.parseEther("0.001"));
    await tx0.wait();

    const tx1 = await deployedContract.connect(address1).createAppointment("Meeting with someone", 1644143400, 1644150600, { value: ethers.utils.parseEther("2") });
    await tx1.wait();

    const tx2 = await deployedContract.connect(address2).createAppointment("Meeting with someone else", 1644154200, 1644159600, { value: ethers.utils.parseEther("2.5") });
    await tx2.wait();

    const appointments = await deployedContract.getAppointments();

    expect(appointments.length).to.equal(1);

    const ownerBalance = await ethers.provider.getBalance(owner.address);
    const addr1Balance = await ethers.provider.getBalance(addr1.address);
    const addr2Balance = await ethers.provider.getBalance(addr2.address);

    console.log(ownerBalance);
    console.log(addr1Balance);
    console.log(addr2Balance);

  });

});
