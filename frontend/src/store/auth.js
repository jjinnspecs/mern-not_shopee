import { create } from 'zustand';

function getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === "undefined") return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

// export const useAuthStore = create((set) => ({
//     token: localStorage.getItem('token') || null,
//     // user: localStorage.getItem('userEmail') ? { email: localStorage.getItem('userEmail') } : null,
//     user: getStoredUser(),

//     setToken: (token) => {
//         localStorage.setItem('token', token);
//         set({ token });
//     },

//     logout: () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         set({ token: null, user: null });
//     },

//     loginAdmin: async (username, password) => {
//         const res = await fetch("/api/auth/admin/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username, password }),
//         });
//         const data = await res.json();
//         if (data.success) {
//             localStorage.setItem('token', data.token);

//             if (data.user) {
//                 localStorage.setItem('user', JSON.stringify(data.user));
//                 set({ token: data.token, user: data.user });
//             } else {
//             set({ token: data.token });
//         }
//     }
//         return data;
//     },

//     requestUserOtp: async (email) => {
//         const res = await fetch("/api/auth/user/request-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email }),
//         });
//         return await res.json();
//     },

//     verifyUserOtp: async (email, otp) => {
//         const res = await fetch ("/api/auth/user/verify-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, otp }),
//         });
//         const data = await res.json();
//         if (data.success) {
//             localStorage.setItem('token', data.token);
//             localStorage.setItem('user', JSON.stringify(data.user));
//             set({ token: data.token, user: data.user });
//         }
//         return data;
        
//     }
// }))

export const useAuthStore = create((set) => {
    const storedToken = localStorage.getItem("token");
    const storedUser = getStoredUser();

    return {
        token: storedToken || null,
        user: storedUser,

        setToken: (token) => {
            localStorage.setItem("token", token);
            set({ token });
        },

        logout: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ token: null, user: null });
        },

    loginAdmin: async (username, password) => {
            try {
                const res = await fetch("/api/auth/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                
                const data = await res.json();
                console.log('Backend response:', data); // Debug log
                
                if (data.success && data.token && data.user) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    set({ token: data.token, user: data.user });
                    console.log('User stored successfully:', data.user); // Debug log
                } else if (data.success && data.token) {
                    // Fallback if user data is missing
                    localStorage.setItem("token", data.token);
                    set({ token: data.token });
                    console.log('Token stored, but no user data'); // Debug log
                }
                
                return data;
            } catch (error) {
                console.error('Login error:', error);
                return { success: false, message: 'Network error' };
            }
        },


        requestUserOtp: async (email) => {
            const res = await fetch("/api/auth/user/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            return await res.json();
        },

        verifyUserOtp: async (email, otp) => {
            const res = await fetch("/api/auth/user/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                set({ token: data.token, user: data.user });
            }
            return data;
        },
    };
});

// export const adminLogin = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ message: 'Username and password are required' });
//         }

//         const admin = await User.findOne({ username, role: 'admin' });
//         if (!admin) 
//             return res.status(401).json({ message: 'Invalid username or password' });
        
//         const isMatch = await bcrypt.compare(password, admin.password);
//         if (!isMatch) 
//             return res.status(401).json({ message: 'Invalid username or password' });
        

//         const token = jwt.sign(
//             { id: admin._id, role: admin.role }, 
//             process.env.JWT_SECRET, 
//             { expiresIn: '1d' }
//         );

//         const userData = {
//             id: admin._id,
//             username: admin.username,
//             role: admin.role
//         };

//         res.json({ 
//             success: true, 
//             token,
//             user: userData 
//         });
//     } catch (error) {
//         console.error('Error during admin login:', error);
//         res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// };
