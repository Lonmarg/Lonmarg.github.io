function deleteEquipment(equipmentID)
{
	$.ajax({
		url: '/equipments/' + equipmentID,
		type: 'DELETE',
		success: function(result){
			window.location.reload(true);
		},
		error: function(result, textStatus) {
			alert(textStatus);
		}
	})
}

function addEquipment(name, pointCost, isSergeantWeapon, isSpecialWeapon)
{
	var name = document.getElementById("equipmentName").value;
	var cost = document.getElementById("equipmentCost").value;
	var sergWeapon = document.getElementById("isSergeantWeaponAdd").checked;
	var specEquip = document.getElementById("isSpecialEquipmentAdd").checked;
	
	console.log('Name: ' + name + ' Cost: ' + cost + ' SergWeapon: ' + sergWeapon + ' SpecEquip: ' + specEquip);
	
	$.ajax({
		url: '/equipments/add',
		type: 'POST',
		data: JSON.stringify({ name: name, cost: cost, sergWeapon: sergWeapon, specEquip: specEquip }),
		dataType: 'json',
		success: function(result){
			window.location.reload(true);
		},
		error: function(result, textStatus) {
			alert(textStatus);
		}
	})
	
		
}