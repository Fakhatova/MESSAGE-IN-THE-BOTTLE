import './NewStoryForm.css';
import React, { useState, useEffect } from 'react';
import { sendNewStory } from '../../apiCalls';
import MicroModal from 'react-micro-modal';
import StoryEdit from '../StoryEdit/StoryEdit';

//**************************** */ MUI Components

import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { ChangeEvent } from 'react';
// import Input from '@mui/material/Input';
// import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';



export const NewStoryForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [error, setError] = useState('');
  const [newStory, setNewStory] = useState(null);
  const [left, setLeft] = useState(1000);

  const getLocation = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  };

  const catchError = () => {
    setError('Sorry, no position available.');
  };

  const submitMessage = (e) => {
    e.preventDefault();
    const newStory = {
      title,
      message,
      longitude,
      latitude,
    };
    sendNewStory(newStory).then((data) => setNewStory(data));
  };

  const setCharacterLimit = (e) => {
    let input = e.target.value;
    setMessage(e.target.value);
    setLeft(1000 - input.length);
    // if ( e.target.value > 1000 ) {

    // }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getLocation, catchError);
  }, []);

  return (
    <div>
      {!newStory && (
        <Box
          className="new-story-modal"
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl variant="standard">
            <TextField
              placeholder="Title"
              label="Title"
              size="small"
              type="text"
              className="title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <Stack direction="column" spacing={4}>
            <FormControl variant="standard">
              <TextField
                label={`${left} characters left`}
                type="text"
                className="message"
                placeholder="Type your story here"
                value={message}
                required
                /// chnaged for TS, syill need fix bug
                inputProps={{
                  maxLength: {left},
                }}

                onChange={(e) => setCharacterLimit(e)}
                multiline
              />
              <FormHelperText id="component-helper-text">
                Your Story
              </FormHelperText>
            </FormControl>
            <Button
              // endIcon={<SendIcon />}
              variant="outlined"
              type="submit"
              className="story-submit-button"
              onClick={(e) => submitMessage(e)}
            >
              Submit Story
            </Button>
          </Stack>
        </Box>
      )}
      {newStory && (
        <MicroModal trigger={(open) => <StoryEdit newStory={newStory} />}>
          {(close) => {
            return <StoryEdit newStory={newStory} />;
          }}
        </MicroModal>
      )}
    </div>
  );
};
