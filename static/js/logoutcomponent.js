const LogoutComponent=Vue.component("LogoutComponent",{
    mounted(){
			fetch("http://127.0.0.1:5000/logout",{
				method:"POST",
				headers:{
					'Content-Type':'application/json'
				}
			})
			.then(response=>{
				if(response.status===200){
					localStorage.removeItem('auth_token');
					window.location.href='/';
				}
			});
    }
});
export default LogoutComponent;

