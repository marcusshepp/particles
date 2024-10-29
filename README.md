# A Particle System

I want to get a lot better at graphics programming. So, right now I'm focusing on canvas.

https://github.com/user-attachments/assets/ee74efbb-6a29-419f-b612-88596c5faaa9


Each particle has an original position. When the cursor is close enough to the particle, that particle calculates a new position based on an editable `radius` around the mouse. 

The speed in which the particle flys to its new position around the radis, is determined by the `speed from cursor`.

When the mouse is no longer close enough, the particle goes back to its original position based on the editable `reposition speed`.

