'use client'

import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Stack, Typography, Button, Modal, TextField, Fade, Zoom, Slide } from '@mui/material'
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import Image from 'next/image'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [itemImage, setItemImage] = useState(null)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item, quantity, image) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity
      await setDoc(docRef, { quantity: currentQuantity + quantity, image })
    } else {
      await setDoc(docRef, { quantity, image })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await deleteDoc(docRef)
    await updateInventory()
  }

  const clearList = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'))
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = () => {
    const result = inventory.find((item) => item.name.toLowerCase() === searchTerm.toLowerCase())
    setSearchResult(result ? result : 'Item not found')
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      setItemImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{
        backgroundImage: 'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)',
        padding: 4,
      }}
    >


      <Typography variant="h2" textAlign="center" mb={2}>
        Welcome to Pantry Tracker
      </Typography>
      <Typography variant="h5" textAlign="center" mb={4}>
        Pantry Tracker is a tool helping you stay more organized by keeping track of all your essentials at home. You can track your groceries, drugs, self-care essentials, pet food, cleaning essentials, and many other things.
      </Typography>
    
      <Zoom in={true} timeout={500}>
        <Button variant="contained" onClick={handleOpen} sx={{ fontSize: '1.2rem', mb: 2 }}>
          Add New Item
        </Button> 
      </Zoom>
      <Zoom in={true} timeout={500}>
        <Button variant="contained" onClick={clearList} sx={{ fontSize: '1.2rem', mb: 4 }}>
          Clear List
        </Button>
      </Zoom>
      <Stack direction={'row'} spacing={2} mb={4}>
        <TextField
          id="search-item"
          label="Search Item"
          variant="outlined"
          fullWidth  
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Stack>
      {searchResult && (
        <Typography variant="h6" color="error">
          {typeof searchResult === 'string' ? searchResult : `Found: ${searchResult.name} (Quantity: ${searchResult.quantity})`}
        </Typography>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic-quantity"
                label="Quantity"
                variant="outlined"
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(Number(e.target.value))}
                sx={{ width: '300px' }}
              />
              <Button
                variant="outlined"
                component="label"
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName, itemQuantity, itemImage)
                  setItemName('')
                  setItemQuantity(1)
                  setItemImage(null)
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Box border={'1px solid #333'} borderRadius={4} overflow="hidden" boxShadow={4} width="800px">
        <Box
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'} p={2}>
          {inventory.map(({ name, quantity, image }) => (
            <Slide direction="up" in={true} mountOnEnter unmountOnExit key={name}>
              <Box
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
                borderRadius={2}
                boxShadow={2}
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: 6,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {image && (
                    <Image
                      src={image}
                      alt={name}
                      width={50}
                      height={50}
                      style={{ borderRadius: '50%' }}
                    />
                  )}
                  <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Box>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            </Slide>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
