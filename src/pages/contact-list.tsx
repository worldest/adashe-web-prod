import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'

interface Contact {
    firstName: string
    lastName: string
    email: string
    phone: string
}

const ContactList = () => {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const storedContacts = localStorage.getItem('contacts')
        if (storedContacts) {
            setContacts(JSON.parse(storedContacts))
        }
    }, [])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setFirstName('')
        setLastName('')
        setEmail('')
        setPhone('')
    }

    const handleAddContact = () => {
        if (!firstName || !lastName || !email || !phone) {
            alert('Please fill in all fields')
            return
        }
        const newContact: Contact = { firstName, lastName, email, phone }
        const updatedContacts = [...contacts, newContact]
        setContacts(updatedContacts)
        localStorage.setItem('contacts', JSON.stringify(updatedContacts))
        handleClose()
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Contact List
            </Typography>
            <Button variant="contained" style={{ backgroundColor: "#89CD7B" }} color="primary" onClick={handleClickOpen} sx={{ mb: 2 }}>
                Add Contact
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button style={{ backgroundColor: "#89CD7B" }} variant="contained" onClick={handleAddContact}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact, index) => (
                            <TableRow key={index}>
                                <TableCell>{contact.firstName}</TableCell>
                                <TableCell>{contact.lastName}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            const updatedContacts = contacts.filter((_, i) => i !== index);
                                            setContacts(updatedContacts);
                                            localStorage.setItem('contacts', JSON.stringify(updatedContacts));
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box>
    )
}

export default ContactList
