import { useEffect, useState } from "react";

function Profile() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setMessage("Please login first");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/users/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message);
                    return;
                }

                setUser(data.user);

            } catch (error) {
                setMessage("Unable to connect to server");
            }
        };

        fetchProfile();
    }, []);

    if (message) {
        return (
            <div className="profile-container">
                <h2>My Profile</h2>
                <p>{message}</p>
            </div>
        );
    }

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-container">
            <h2>My Profile</h2>

            <div className="profile-card">
                <p>
                    <strong>Name:</strong> {user.name}
                </p>

                <p>
                    <strong>Email:</strong> {user.email}
                </p>

                <p className="authenticated">
                    ✓ Authenticated User
                </p>
            </div>
        </div>
    );
}

export default Profile;