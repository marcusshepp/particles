# A Particle System

I want to get a lot better at graphics programming. So, right now I'm focusing on canvas.

https://github.com/user-attachments/assets/ee74efbb-6a29-419f-b612-88596c5faaa9


## How it works 
Each particle has an original position. When the cursor is close enough to the particle, that particle calculates a new position based on an editable `radius` around the mouse. 

The speed in which the particle flys to its new position around the radis, is determined by the `speed from cursor`.

When the mouse is no longer close enough, the particle goes back to its original position. The speed in which it repositions itself is based on the editable `reposition speed`.

## Why??
Because if I'm typing and thinking, I'm happy.


## If you want to mess with this

The only dependencies are typescript and vite.

- Clone the repo
- `pnpm i`
- `pnpm dev`


