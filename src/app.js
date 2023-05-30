debugger
var MyTokenABI = [];
var ConractAddress = "";
const networkId = '5777'; // Replace with the appropriate network ID
fetch('http://127.0.0.1:5500//build/contracts/SagoToken.json')
  .then(response => response.json())
  .then(data => {
    // Process the JSON data
    MyTokenABI = data;
    ConractAddress = data.networks[networkId].address;
    console.log(data);
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });
let web3;
//const fs = require('fs');
//var MyTokenABI = GetJson();
$(document).ready(function () {
    debugger
    enableDapp();
});
// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(".nav-link").click(function () {
    $(".nav-link,.tab-pane").removeClass("active");
    $(this).addClass("active");
    $(".tab-pane").addClass("fade");
    var id = $(this).data("id");
    $("#" + id).removeClass("fade").addClass("active");
});
/* ---- particles.js config ---- */

particlesJS("particles-js", {
    particles: {
        number: {
            value: 380,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: "img/github.svg",
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "grab"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

/* ---- stats.js config ---- */

var count_particles, stats, update;
stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);
count_particles = document.querySelector(".js-count-particles");
update = function () {
    stats.begin();
    stats.end();
    if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
        count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
    }
    requestAnimationFrame(update);
};
requestAnimationFrame(update);

var Address = "";
async function enableDapp() {

    if (typeof window.ethereum !== 'undefined') {
        try {
            accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });
            web3 = new Web3(window.ethereum);
            Address = accounts[0];
            var abi = MyTokenABI.abi;
            var contractInstance = new web3.eth.Contract(abi, ConractAddress);
            contractInstance.methods.EmitDetails()
                .send({ from: Address })
                .then((receipt) => {
                    bindData(receipt.events.GetDetails);
                })
                .catch((error) => {
                    console.error('Transaction error:', error);
                });
        } catch (error) {
            if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                statusText.innerHTML = "Error: Need permission to access MetaMAsk";
                console.log('Permissions needed to continue.');
            } else {
                console.error(error.message);
            }
        }
    } else {
        alert("Error: Need to install MetaMask");
    }
};


async function BuyToken() {
    var abi = MyTokenABI.abi;
    var contractInstance = new web3.eth.Contract(abi, ConractAddress);
    if ($("#buyAmount").val() == "") {
        AlertFunction('Please enter the no of ehter', 'error');
        return false;
    }
    debugger

    const amount = $("#buyAmount").val() * 1000000000000000000;
    contractInstance.methods.BuyToken().send({
        from: Address,
        value: amount
    })
        .then((receipt) => {
            debugger
            console.log('Transaction receipt:', receipt);
            if (receipt.status) {
                AlertFunction('You have purchased SGN suucessfully', 'success');
                bindData(receipt.events.GetDetails);
            } else {
                AlertFunction('unable to buy the token', 'error');
            }
        })
        .catch((error) => {
            console.error('Transaction error:', error);
        });
}


async function SellToken() {
    debugger
    var abi = MyTokenABI.abi;
    var contractInstance = new web3.eth.Contract(abi, ConractAddress);
    if ($("#sellAmount").val() == "") {
        AlertFunction('Please enter the no of token', 'error');
        return false;
    }
    contractInstance.methods.SellToken($("#sellAmount").val())
        .send({ from: Address })
        .then((receipt) => {
            if (receipt.status) {
                AlertFunction('You have successfully sold your token', 'success');
                bindData(receipt.events.GetDetails);
            } else {
                AlertFunction('unable to buy the token', 'error');
            }
        })
        .catch((error) => {
            console.error('Transaction error:', error);
        });

}

async function TransferToken() {
    debugger
    var abi = MyTokenABI.abi;
    var contractInstance = new web3.eth.Contract(abi, ConractAddress);
    if ($("#txtNoToken").val() == "" || $("#txtNoToken").val() == "") {
        AlertFunction('Please enter the no of token', 'error');
        return false;
    }
    contractInstance.methods.TranferToken($("#toAddress").val(), $("#txtNoToken").val())
        .send({ from: Address })
        .then((receipt) => {
            if (receipt.status) {
                AlertFunction('Token transfered successfully to this account - ' + $("#txtNoToken").val(), 'success');
                bindData(receipt.events.GetDetails);

            } else {
                AlertFunction('unable to buy the token', 'error');
            }
        })
        .catch((error) => {
            console.error('Transaction error:', error);
        });

}

var GetAbiJson = () => {
    $.ajax({
        url: '/Files/abi.json',
        dataType: 'json',
        success: function (data) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });

}

function AlertFunction(message, type) {
    Swal.fire({

        icon: type,
        title: type,
        text: message
    });
}

function bindData(data) {
    $("#CurrentSupply").html(data.returnValues.CurrentSupply + " SGN");
    $("#spnToken").html(data.returnValues.TotalUserTOken + " SGN");
    $("#spnSGNPrice").html(web3.utils.fromWei(data.returnValues.SGNPrice, 'ether') + " ETH");
    $("#spnTotalSuply").html(data.returnValues.TotalSupply + " SGN");
    $("#TotalValue").html(data.returnValues.TotalPrice + " ETH");
}
function GetJson() {
    fs.readFile('http://localhost:3000//build/contracts/SagoToken.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return;
        }

        const jsonData = JSON.parse(data);
        // Process the JSON data
        console.log(jsonData);
        return jsonData;
    });

    // return fetch('http://localhost:3000//build/contracts/SagoToken.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         // Process the JSON data
    //         return data;
    //     })
    //     .catch(error => {
    //         // Handle any errors
    //         console.error('Error:', error);
    //     });
}