/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.com.isis.adventureISIServer.classes;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

/**
 *
 * @author psandre
 */
public class Services {

    InputStream input = getClass().getClassLoader().getResourceAsStream("world.xml");

    public World readWorldFromXml() throws JAXBException {
        try {
            File file = new File("world.xml");
            JAXBContext cont = JAXBContext.newInstance(World.class);
            Unmarshaller u = cont.createUnmarshaller();
            World world = (World) u.unmarshal(file);
            return world;
        } catch (Exception e) {
            JAXBContext cont = JAXBContext.newInstance(World.class);
            Unmarshaller u = cont.createUnmarshaller();
            World world = (World) u.unmarshal(input);
            return world;
        }
    }

    public void saveWorldToXml(World world) throws FileNotFoundException, JAXBException, IOException {
        OutputStream output = new FileOutputStream("world.xml");
        JAXBContext cont = JAXBContext.newInstance(World.class);
        Marshaller m = cont.createMarshaller();
        m.marshal(world, output);
        output.close();
    }

    public World getWorld() throws JAXBException, FileNotFoundException, IOException {
        return readWorldFromXml();
    }

}
